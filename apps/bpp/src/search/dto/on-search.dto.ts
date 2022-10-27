import ContextInterface from 'dsep-beckn-schema/schemas/Context.interface';

export class SearchDTO {
  context: ContextInterface;
  message: {
    intent: {
      tags: {
        block?: string;
        district?: string;
        bank_name?: string;
      };
    };
  };
}
