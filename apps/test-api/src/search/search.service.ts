import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService) {}
  async handleSearchRequest(body: any) {
    try {
      console.log('in test-api search: ', body);
      console.log('search context: ', body.context);
      console.log('search message: ', body.message);
      const block: string = body.message.intent.tags.block || '';
      const district: string = body.message.intent.tags.district || '';
      const bank_name: string = body.message.intent.tags.bank_name || '';
      const gql: any = `{
        credit_products(where: { bank_name: { _ilike: "%${bank_name}%" }, district: { _ilike: "%${district}%" }, block: { _ilike: "%${block}%" } }) {
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
      const providerResponseData = await lastValueFrom(
        this.httpService
          .post(process.env.HASURA_URI, { query: gql }, requestOptions)
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );

      //respData contains the response from the graphql query
      const prods = providerResponseData.data.credit_products;
      const providerWise = {};

      for (const prod of prods) {
        if (!providerWise[prod.bank_name]) {
          providerWise[prod.bank_name] = [prod];
        } else {
          providerWise[prod.bank_name].push(prod);
        }
      }

      const responseCatalog = {
        context: {
          ...body.context,
        },
        message: {
          catalog: {
            descriptor: {
              name: `Catalogue for search query with block: ${block}, district: ${district}, bank_name: ${bank_name}`,
            },
            providers: Object.keys(providerWise).map((provider) => {
              return {
                id: provider,
                descriptor: {
                  name: provider,
                },
                items: providerWise[provider].map((prod) => {
                  return {
                    id: prod.id + '',
                    descriptor: {
                      name: prod.loan_product,
                    },
                    price: {
                      currency: 'INR',
                      value: prod.maximum_loan_amt + '',
                    },
                    provider: {
                      id: provider,
                    },
                    tags: [
                      {
                        block: prod.block,
                        district: prod.district,
                        loan_tenure: prod.loan_tenure,
                        interest_rate: prod.interest_rate,
                        processing_charges: prod.processing_charges,
                      },
                    ],
                  };
                }),
              };
            }),
          },
        },
      };

      console.log('responseCatalog: ', responseCatalog);

      // fixes as per 1.0.0
      responseCatalog['context'].action = 'on_search';

      return responseCatalog;
    } catch (err) {
      console.log('err in test-api search: ', err);
      throw new InternalServerErrorException(err);
    }
  }
}
