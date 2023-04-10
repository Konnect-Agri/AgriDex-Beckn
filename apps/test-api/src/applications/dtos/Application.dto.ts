import { ApiProperty } from '@nestjs/swagger';

export class OrderDetails {

}

class LoanApplicationItem {
  @ApiProperty({
    type: String,
    description: 'Order Id of the loan application',
  })
  order_id: string;

  order_details: {
    id: string;
    provider: {
      id: string;
      items: [
        {
          id: string;
          tags: {
            block: string;
            district: string;
            loan_tenure: string;
            interest_rate: string;
            processing_charges: string;
          };
          price: string;
          provider: {
            id: string;
          };
          descriptor: {
            name: string;
          };
        },
      ];
      descriptor: {
        name: string;
      };
      fulfillments: [
        {
          id: string;
          type: string;
          agent: {
            name: string;
          };
          tracking: string;
          provider_id: string;
        },
      ];
    };
    updated_at: string;
    loan_application_doc: {
      applicant_details: {
        basic_details: {
          dob: string;
          name: string;
          tags: {
            fathers_name: string;
            mothers_name: string;
            marital_status: string;
          };
          gender: string;
          aadhar_number: string;
          pan_card_number: string;
          educatioal_qualification: string;
        };
        income_details: {
          other_income: string;
          total_income: string;
          agricultural_income: string;
          other_income_source: string;
          agricultural_income_source: string;
        };
        guarantor_details: {
          name: string;
          email: string;
          mobile: string;
          relationship: string;
          pan_card_number: string;
        };
        permanent_correspondence_details: {
          address: string;
          contact: {
            phone: string;
          };
        };
        temporary_correspondence_details: {
          address: string;
          contact: {
            email: string;
            phone: string;
          };
        };
      };
      application_basic_info: {
        block: string;
        amount: string;
        district: string;
        project_type: string;
      };
    };
  };
}

class LoanApplications {
  @ApiProperty()
  loan_applications: ReadonlyArray<LoanApplicationItem>;
}

export class ApplicationDTO {
  @ApiProperty({
    type: LoanApplications,
    description: 'Loan Applications are returned by the server',
  })
  data: LoanApplications;
}
