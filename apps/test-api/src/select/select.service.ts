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

      const aadhar_email_maps = {
        'farmer-1': 331081000000,
        'farmer-2': 334130000000,
        'farmer-3': 756744000000,
        'farmer-4': 634896000000,
        'farmer-5': 860668000000,
        'farmer-6': 727414000000,
        'farmer-7': 512968000000,
        'farmer-8': 519193000000,
      };

      const authResp = await lastValueFrom(
        this.httpService
          .post(
            'https://auth.konnect.samagra.io/api/login',
            {
              loginId: process.env.LOGIN_ID,
              password: process.env.PASSWORD,
              applicationId: process.env.APPLICATION_ID,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: process.env.AUTH_TOKEN_FOR_DC_LOGIN,
              },
            },
          )
          .pipe(map((item) => item.data)),
      );

      console.log('auth resp: ', authResp);

      // getting data from Query resolver
      const preFillingData = await lastValueFrom(
        this.httpService
          .post(
            process.env.AUTHENTICATION_URI,
            {
              consentArtifact: {
                id: '927d81cf-77ee-4528-94d1-2d98a2595740',
                caId: '036232e5-0ac7-4863-bad2-c70e70ef2d2f',
                consent_artifact: {
                  id: '036232e5-0ac7-4863-bad2-c70e70ef2d2f',
                  log: {
                    consent_use: {
                      url: 'https://sample-log/api/v1/log',
                    },
                    data_access: {
                      url: 'https://sample-log/api/v1/log',
                    },
                  },
                  data: `query MyQuery {\n  query_resolver_table(where: {vch_aadharno: {_eq: "${aadhar_email_maps[body.message.order.fulfilment.customer.person.cred]}"}}) {\n    int_day\n    int_gender\n    int_marital_status\n    int_month\n    int_primary_mobile_number\n    int_year\n    vch_aadharno\n    vch_address\n    vch_farmer_name\n    vch_father_name\n    vch_village\n    vch_district\n  }\n}\n`,
                  user: {
                    id: body.message.order.fulfilment.customer.person.cred,
                  },
                  proof: {
                    jws: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzNjIzMmU1LTBhYzctNDg2My1iYWQyLWM3MGU3MGVmMmQyZiIsImxvZyI6eyJjb25zZW50X3VzZSI6eyJ1cmwiOiJodHRwczovL3NhbXBsZS1sb2cvYXBpL3YxL2xvZyJ9LCJkYXRhX2FjY2VzcyI6eyJ1cmwiOiJodHRwczovL3NhbXBsZS1sb2cvYXBpL3YxL2xvZyJ9fSwiZGF0YSI6IjxWYWxpZCBzdXBlcnNldCBHcmFwaFFMIHF1ZXJ5IG9mIGNvbnNlbnRlZCBkYXRhPiIsInVzZXIiOnsiaWQiOiJmYXJtZXItMUBnbWFpbC5jb20ifSwiY3JlYXRlZCI6IllZWVktTU0tRERUaGg6bW06c3Nabi5uIiwiZXhwaXJlcyI6IllZWVktTU0tRERUaGg6bW06c3Nabi5uIiwicHVycG9zZSI6IiIsInJldm9rZXIiOnsiaWQiOiJkaWQ6dXNlcjoxMjMiLCJ1cmwiOiJodHRwczovL3NhbXBsZS1yZXZva2VyL2FwaS92MS9yZXZva2UifSwiY29uc3VtZXIiOnsiaWQiOiJkaWQ6Y29uc3VtZXI6MTIzIiwidXJsIjoiaHR0cHM6Ly9zYW1wbGUtY29uc3VtZXIvYXBpL3YxL2NvbnN1bWUifSwicHJvdmlkZXIiOnsiaWQiOiJkaWQ6cHJvaWRlcjoxMjMiLCJ1cmwiOiJodHRwczovL3NhbXBsZS1jb25zdW1lci9hcGkvdjEifSwiY29sbGVjdG9yIjp7ImlkIjoiZGlkOmNvbGxlY3RvcjoxMjMiLCJ1cmwiOiJodHRwczovL2ExMTItMTAzLTIxMi0xNDctMTMwLmluLm5ncm9rLmlvIn0sImZyZXF1ZW5jeSI6eyJ0dGwiOjUsImxpbWl0IjoyfSwicmV2b2NhYmxlIjpmYWxzZSwic2lnbmF0dXJlIjoiIiwidXNlcl9zaWduIjoiIiwiY29sbGVjdG9yX3NpZ24iOiIiLCJ0b3RhbF9xdWVyaWVzX2FsbG93ZWQiOjEwLCJpYXQiOjE2Njk5Mzk1OTYsImV4cCI6MTY3MDM3MTU5NiwiYXVkIjoiZGlkOmNvbnN1bWVyOjEyMyIsImlzcyI6ImNvbnNlbnQtbWFuYWdlciIsInN1YiI6ImZhcm1lci0xQGdtYWlsLmNvbSJ9.UNyoXDgMxbIVaBoK0J7OBX7ybUlZNx309KdbetoeJLqGaZbfFav3rZyoPnQNpQyAFHp8MaNczzlI0JlTSStqJl0E-Z1oGK6M-hREE1261zSxZMAueIgpNEVpNiUH4gRhleTBaKPH0EoZT27ORqZmULb2UMDfw1Gy9RuH7cHzJYdBDmi5fkePhsN8T3Z03OgnUWHHPTxwS4_szS3fLGMmJvUTyrK-UBwkMslajdoWN3vcp4MERv60F8yIk7GqGGkNHEiaLe_g_Zi73KOKDbdWOLapQiO8kwpAyblu6maNF8w4VdIft4zFT4SiloJWxeYNZUeT0ROHscTbdLOaTCn-Ag',
                    type: 'RS256',
                    created: '12/2/2022, 12:06:36 AM',
                    proofPurpose: 'jwtVerify',
                    verificationMethod:
                      'https://auth.konnect.samagra.io/.well-known/jwks',
                  },
                  created: 'YYYY-MM-DDThh:mm:ssZn.n',
                  expires: 'YYYY-MM-DDThh:mm:ssZn.n',
                  purpose: '',
                  revoker: {
                    id: 'did:user:123',
                    url: 'https://sample-revoker/api/v1/revoke',
                  },
                  consumer: {
                    id: 'did:consumer:123',
                    url: 'https://sample-consumer/api/v1/consume',
                  },
                  provider: {
                    id: 'did:proider:123',
                    url: 'https://sample-consumer/api/v1',
                  },
                  collector: {
                    id: 'did:collector:123',
                    url: 'https://a112-103-212-147-130.in.ngrok.io',
                  },
                  frequency: {
                    ttl: 5,
                    limit: 2,
                  },
                  revocable: false,
                  signature: '',
                  user_sign: '',
                  collector_sign: '',
                  total_queries_allowed: 10,
                },
                userId: 'farmer-1@gmail.com',
                state: 'ACCEPT',
                created_at: '2022-12-02T00:05:46.090Z',
                created_by: 'API',
                updated_at: '2022-12-02T00:05:46.090Z',
                updated_by: null,
                webhook_url: 'https://sample-consumer/api/v1/consume',
                total_attempts: 0,
              },
              gql: `query MyQuery {\n  query_resolver_table(where: {vch_aadharno: {_eq: "${aadhar_email_maps[body.message.order.fulfilment.customer.person.cred]}"}}) {\n    int_day\n    int_gender\n    int_marital_status\n    int_month\n    int_primary_mobile_number\n    int_year\n    vch_aadharno\n    vch_address\n    vch_farmer_name\n    vch_father_name\n    vch_village\n    vch_district\n  }\n}\n`,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authResp.token}`,
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
