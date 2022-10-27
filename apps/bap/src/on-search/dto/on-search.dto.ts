import ContextInterface from 'dsep-beckn-schema/schemas/Context.interface';
import IntentInterface from 'dsep-beckn-schema/schemas/Intent.interface';

export class SearchDTO {
  context: ContextInterface;
  message: {
    intent?: IntentInterface;
  };
}

export class SearchReq {
  message: {
    block?: string;
    district?: string;
    bank_name?: string;
  };
}
