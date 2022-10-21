import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { SearchDTO } from './dto/search.dto';

@Injectable()
export class OnSearchService {
  constructor(private readonly httpService: HttpService) { }

  async handleOnSearch(searchDTO: SearchDTO) {
    try {
      const block: string = searchDTO.message.tags?.block || '';
      const district: string = searchDTO.message.tags?.district || '';
      const bank_name: string = searchDTO.message.tags?.bank_name || '';
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
      const responseCatalogue = {
        context: {
          ...searchDTO.context,
          bpp_uri: 'http://localhost:3002/on-search',
          bpp_id: '301',
        },
        message: {
          catalogue: {
            items: prods.map((prod) => {
              return {
                descriptor: {
                  name: prod.loan_product,
                },
                price: prod.maximum_loan_amt,
                provider: {
                  id: prod.bank_name,
                },
                tags: {
                  block: prod.block,
                  district: prod.district,
                  loan_tenure: prod.loan_tenure,
                  maximum_loan_amt: prod.maximum_loan_amt,
                  interest_rate: prod.interest_rate,
                  processing_charges: prod.processing_charges,
                },
              };
            }),
          },
        },
      };

      return responseCatalogue;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
