import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { OnSearchDTO } from './dto/on_search.dto';

@Injectable()
export class OnSearchService {
  constructor(private readonly httpService: HttpService) { }

  async handleOnSearch(onSearchDTO: OnSearchDTO) {
    try {
      const block: string = onSearchDTO.message.block || '';
      const district: string = onSearchDTO.message.district || '';
      const bank_name: string = onSearchDTO.message.bank_name || '';
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
      const responseData = await lastValueFrom(
        this.httpService
          .post(process.env.HASURA_URI, { query: gql }, requestOptions)
          .pipe(
            map((response) => {
              return response.data;
            }),
          ),
      );

      return responseData;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException();
    }
  }
}
