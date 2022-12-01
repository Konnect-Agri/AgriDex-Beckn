import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { generateSelectMessage } from 'utils/generators';

@Injectable()
export class SelectService {
  constructor(private readonly httpService: HttpService) { }
  async handleSelectRequest(body: any) {
    try {
      const itemId = body.message.order.items[0].id;
      const gql: any = `{
        credit_products(where: { id: { _eq: ${itemId} } }) {
          bank_name
          block
          district
          id
          interest_rate
          loan_product
          loan_tenure
          maximum_loan_amt
          processing_charges
        }
      }`;

      const requestOptions = {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': process.env.SECRET,
        },
      };
      console.log('sending query: ', gql);
      const searchResponseData = await lastValueFrom(
        this.httpService
          .post(process.env.HASURA_URI, { query: gql }, requestOptions)
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );
      const item = searchResponseData.data.credit_products[0];
      console.log('item in response data: ', item);

      const response = {
        context: body.context,
        message: generateSelectMessage({
          order_id: body.message.order.id,
          provider: {
            id: body.message.order.provider.id,
            name: body.message.order.provider.id,
          },
          item: {
            id: item.id,
            name: item.loan_product,
            price: item.maximum_loan_amt,
            tags: {
              block: item.block,
              district: item.district,
              loan_tenure: item.loan_tenure,
              interest_rate: item.interest_rate,
              processing_charges: item.processing_charges,
            },
          },
          fulfillment: [
            {
              id: 'abc-fulfillment-1',
              type: 'LOAN_APPLICATION_PROCESSING',
              provider_id: body.message.order.provider.id,
              tracking: true,
              agent: {
                name: 'Jon Doe',
                phone: 1234567890,
                email: 'sample@example.com',
                gender: 'M',
              },
            },
          ],
        }),
      };

      // insert this response as a draft order in the HASURA
      const createOrderGQL = `mutation insertLoanApplication ($application: loan_applications_insert_input!){
        insert_loan_applications_one (object: $application) {
          order_id
          order_details
        }
      }`;

      // getting data from Query resolver

      const preFillingData = await lastValueFrom(
        this.httpService
          .post(
            process.env.AUTHENTICATION_URI,
            {
              consentArtifact: {
                created: 'YYYY-MM-DDThh:mm:ssZn.n',
                expires: 'YYYY-MM-DDThh:mm:ssZn.n',
                id: '',
                revocable: false,
                collector: {
                  id: '',
                  url: 'https://sample-collector/api/v1/collect',
                },
                consumer: {
                  id: '',
                  url: 'https://sample-consumer/api/v1/consume',
                },
                provider: {
                  id: '',
                  url: 'https://sample-consumer/api/v1',
                },
                user: {
                  type: 'AADHAAR|MOBILE|PAN|PASSPORT|...',
                  name: '',
                  issuer: '',
                  dpID: '',
                  cmID: '',
                  dcID: '',
                },
                revoker: {
                  url: 'https://sample-revoker/api/v1/revoke',
                  name: '',
                  id: '',
                },
                purpose: '',
                user_sign: '',
                collector_sign: '',
                log: {
                  consent_use: {
                    url: 'https://sample-log/api/v1/log',
                  },
                  data_access: {
                    url: 'https://sample-log/api/v1/log',
                  },
                },
                // data: 'query MyQuery {\n  attendance {\n    id\n    date\n  }\n}',
                data: 'query MyQuery {\n  query_resolver_table {\n    int_day\n    int_gender\n    int_marital_status\n    int_month\n    int_primary_mobile_number\n    int_year\n    vch_aadharno\n    vch_address\n    vch_farmer_name\n    vch_father_name\n    vch_village\n    vch_district\n  }\n}\n',
              },
              gql: 'query MyQuery {\n  query_resolver_table {\n    int_day\n    int_gender\n    int_marital_status\n    int_month\n    int_primary_mobile_number\n    int_year\n    vch_aadharno\n    vch_address\n    vch_farmer_name\n    vch_father_name\n    vch_village\n    vch_district\n  }\n}\n',
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.AUTH_JWT}`,
              },
            },
          )
          .pipe(map((item) => item.data)),
      );
      console.log('prefilled data: ', preFillingData);
      const dataToMap = preFillingData.query_resolver_table[0];
      response.message.order['loan_application_doc'] = {
        applicant_details: {
          basic_details: {
            dob:
              dataToMap.int_day +
              '-' +
              dataToMap.int_month_ +
              '-' +
              dataToMap.int_year,
            name: dataToMap.vch_farmer_name,
            tags: {
              fathers_name: dataToMap.vch_father_name,
              marital_status:
                dataToMap.int_marital_status === '1' ? 'Single' : 'Married',
            },
            gender: dataToMap.int_gender === '1' ? 'F' : 'M',
            aadhar_number: dataToMap.vch_aadharno,
          },
          permanent_correspondence_details: {
            address: dataToMap.vch_address,
            contact: {
              phone: dataToMap.int_primary_mobile_number,
            },
          },
          temporary_correspondence_details: {
            address: dataToMap.vch_address,
            contact: {
              phone: dataToMap.int_primary_mobile_number,
            },
          },
        },
        application_basic_info: {
          district: dataToMap.vch_district,
        },
      };

      const confirmedOrder = await lastValueFrom(
        this.httpService
          .post(
            process.env.HASURA_URI,
            {
              query: createOrderGQL,
              variables: {
                application: {
                  order_id: body.message.order.id,
                  order_details: response.message.order,
                },
              },
            },
            requestOptions,
          )
          .pipe(map((item) => item.data)),
      );

      console.log('confirmed order: ', confirmedOrder.errors);

      console.log('response for select in test-api: ', response);

      return response;
    } catch (err) {
      console.log('err in select service of test-api: ', err);
      throw new InternalServerErrorException(err);
    }
    return;
  }
}
