export const contextGenerator = (
  transactionId: string,
  action: string,
  bap_uri: string,
  bap_id: string,
  bpp_uri?: string,
  bpp_id?: string,
) => {
  return {
    transaction_id: transactionId,
    message_id: transactionId,
    action: action,
    timestamp: Date.now(),
    domain: 'agriculture',
    country: { code: 'IND' },
    city: { code: 'DEL' },
    core_version: '0.9.3',
    bap_uri: bap_uri,
    bap_id: bap_id,
    bpp_uri: bpp_uri ? bpp_uri : undefined,
    bpp_id: bpp_id ? bpp_id : undefined,
  };
};

type ORDER_DATA = {
  project_type?: string;
  district?: string;
  block?: string;
  branch?: string;
  loan_amount?: string;
  name?: string;
  gender?: string;
  marital_status?: string;
  age?: string;
  mothers_name?: string;
  fathers_name?: string;
  date_of_birth?: string;
  educational_qualitfication?: string;
  PAN_Number?: string;
  Aadhar_Number?: string;
  Address?: string;
  Pin_Code?: string;
  Phone_number?: string;
  Email_Id?: string;
  Permanent_Address?: string;
  Permanent_Pin_Code?: string;
  Permanent_Phone_number?: string;
  Permanent_Email_Id?: string;
  Agricultural_Income_Source?: string;
  Agricultural_Income?: string;
  Other_Income_Source?: string;
  Other_Income?: string;
  Total_Income?: string;
  Guarantor_Name?: string;
  Relationship_with_Guarantor?: string;
  Mobile_number_of_the_guarantor?: string;
  Email_ID_of_the_Guarantor?: string;
  PAN_card_number_of_guarantor?: string;
};

type ORDER_APPLICATION_FORM = {
  loan_application_doc: {
    application_basic_info: {
      sector: string;
      project_type: string;
      district: string;
      block: string;
      amount: string;
    };
    applicant_details: {
      basic_details: {
        name: string;
        gender: string;
        dob: string;
        tags: {
          marital_status: string;
          fathers_name: string;
          mothers_name: string;
        };
        pan_card_number: string;
        aadhar_number: string;
        educatioal_qualification: string;
      };
      temporary_correspondence_details: {
        address: string;
        //{
        // building: "Sky Towers",
        // street: "Street 1",
        // locality: "Locality 1",
        // ward: "Ward 1",
        // city: "Angul",
        // state: "Odisha",
        // country: "INDIA",
        // area_code: "124001",
        // },
        contact: {
          phone: string;
          email: string;
        };
      };
      permanent_correspondence_details: {
        address: string;
        //{
        // building: "Sky Towers",
        // street: "Street 1",
        // locality: "Locality 1",
        // ward: "Ward 1",
        // city: "Angul",
        // state: "Odisha",
        // country: "INDIA",
        // area_code: "124001",
        // },
        contact: {
          phone: string;
          email: string;
        };
      };
      income_details: {
        agricultural_income_source: string;
        agricultural_income: string;
        other_income_source: string;
        other_income: string;
        total_income: string;
      };
      guarantor_details: {
        name: string;
        relationship: string;
        mobile: string;
        email: string;
        pan_card_number: string;
      };
    };
  };
};

export const generateOrder = (
  action: string,
  formData: ORDER_DATA,
  preFilledForm?: ORDER_APPLICATION_FORM,
) => {
  const order: ORDER_APPLICATION_FORM = preFilledForm;
  console.log('pre filled order in generator: ', order);
  Object.keys(formData).forEach((key) => {
    const val = formData[key];
    switch (key) {
      case 'project_type':
        order.loan_application_doc.application_basic_info.project_type = val;
        break;
      case 'district':
        order.loan_application_doc.application_basic_info.district = val;
        break;
      case 'block':
        order.loan_application_doc.application_basic_info.block = val;
        break;
      case 'loan_amount':
        order.loan_application_doc.application_basic_info.amount = val;
        break;
      case 'name':
        order.loan_application_doc.applicant_details.basic_details.name = val;
        break;
      case 'gender':
        order.loan_application_doc.applicant_details.basic_details.gender = val;
        break;
      case 'marital_status':
        order.loan_application_doc.applicant_details.basic_details.tags.marital_status = val;
        break;
      case 'age':
        order.loan_application_doc.applicant_details.basic_details.dob = val;
        break;
      case 'fathers_name':
        order.loan_application_doc.applicant_details.basic_details.tags.fathers_name = val;
        break;
      case 'mothers_name':
        order.loan_application_doc.applicant_details.basic_details.tags.mothers_name = val;
        break;
      case 'educational_qualitfication':
        order.loan_application_doc.applicant_details.basic_details.educatioal_qualification = val;
        break;
      case 'PAN_Number':
        order.loan_application_doc.applicant_details.basic_details.pan_card_number = val;
        break;
      case 'Aadhar_Number':
        order.loan_application_doc.applicant_details.basic_details.aadhar_number = val;
        break;
      case 'Address':
        order.loan_application_doc.applicant_details.temporary_correspondence_details.address = val;
        break;
      case 'Pin_Code':
        order.loan_application_doc.applicant_details.temporary_correspondence_details.address = val;
        break;
      case 'Phone_number':
        order.loan_application_doc.applicant_details.temporary_correspondence_details.contact.phone =
          val;
        break;
      case 'Email_Id':
        order.loan_application_doc.applicant_details.temporary_correspondence_details.contact.email =
          val;
        break;
      case 'Permanent_Address':
        order.loan_application_doc.applicant_details.permanent_correspondence_details.address = val;
        break;
      case 'Permanent_Pin_Code':
        order.loan_application_doc.applicant_details.permanent_correspondence_details.address = val;
        break;
      case 'Permanent_Phone_number':
        order.loan_application_doc.applicant_details.permanent_correspondence_details.contact.phone =
          val;
        break;
      case 'Permanent_Email_Id':
        order.loan_application_doc.applicant_details.permanent_correspondence_details.contact.email =
          val;
        break;
      case 'Agricultural_Income_Source':
        order.loan_application_doc.applicant_details.income_details.agricultural_income_source = val;
        break;
      case 'Agricultural_Income':
        order.loan_application_doc.applicant_details.income_details.agricultural_income = val;
        break;
      case 'Other_Income_Source':
        order.loan_application_doc.applicant_details.income_details.other_income_source = val;
        break;
      case 'Other_Income':
        order.loan_application_doc.applicant_details.income_details.other_income = val;
        break;
      case 'Total_Income':
        order.loan_application_doc.applicant_details.income_details.total_income = val;
        break;
      case 'Guarantor_Name':
        order.loan_application_doc.applicant_details.guarantor_details.name = val;
        break;
      case 'Guarantor_Relationship':
        order.loan_application_doc.applicant_details.guarantor_details.relationship = val;
        break;
      case 'Guarantor_Mobile':
        order.loan_application_doc.applicant_details.guarantor_details.mobile = val;
        break;
      case 'Guarantor_Email':
        order.loan_application_doc.applicant_details.guarantor_details.email = val;
        break;
      case 'Guarantor_PAN_Number':
        order.loan_application_doc.applicant_details.guarantor_details.pan_card_number = val;
        break;
      default:
        break;
    }
  });

  return order;
};
