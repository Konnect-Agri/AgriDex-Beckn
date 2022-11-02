import ContextInterface from 'dsep-beckn-schema/schemas/Context.interface';
import IntentInterface from 'dsep-beckn-schema/schemas/Intent.interface';

export class SearchDTO {
  context: ContextInterface;
  message: {
    catalogue: {
      descriptor?: {
        name: string;
      };
      providers?: ReadonlyArray<{
        id: string;
        locations: ReadonlyArray<{
          id: string;
          descriptor: {
            name: string;
          };
        }>;
      }>;
    };
  };
}
export class SearchReq {
  message: {
    block?: string;
    district?: string;
    bank_name?: string;
  };
}
