import { ApiProperty } from '@nestjs/swagger';

class BecknContext {
  @ApiProperty({
    type: String,
    description: 'The domain of the request',
  })
  domain: string;

  @ApiProperty({
    type: String,
    description: 'The transaction id of the request',
  })
  transaction_id: string;

  @ApiProperty({
    type: String,
    description: 'The message id of the request',
  })
  message_id: string;

  @ApiProperty({
    type: String,
    description: 'The action of the request',
  })
  action: string;

  @ApiProperty({
    type: String,
    description: 'The timestamp of the request',
  })
  timestamp: string;

  @ApiProperty({
    type: String,
    description: 'The country of the request',
  })
  country: string;

  @ApiProperty({
    type: String,
    description: 'The city of the request',
  })
  city: string;

  @ApiProperty({
    type: String,
    description: 'The version of the request',
  })
  version: string;

  @ApiProperty({
    type: String,
    description: 'The bap uri of the request',
  })
  bap_uri: string;

  @ApiProperty({
    type: String,
    description: 'The bap id of the request',
  })
  bap_id: string;

  @ApiProperty({
    type: String,
    description: 'The bpp id of the request',
  })
  bpp_id?: string;

  @ApiProperty({
    type: String,
    description: 'The bpp uri of the request',
  })
  bpp_uri?: string;
}

export class GenericBecknRequestBody {
  @ApiProperty({
    type: BecknContext,
    description: 'The context of the request',
  })
  context: BecknContext;
  @ApiProperty({
    type: Object,
    description: 'The message body of the request',
  })
  message: any;
}
