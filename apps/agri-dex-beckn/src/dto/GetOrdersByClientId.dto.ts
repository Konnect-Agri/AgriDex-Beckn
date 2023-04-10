import { ApiProperty } from '@nestjs/swagger';

class OrderClientMappingsItem {
  @ApiProperty({
    type: String,
    description: 'Client ID',
  })
  client_id: string;
  @ApiProperty({
    type: String,
    description: 'Order ID',
  })
  order_id: string;
}

class OrderClientMappings {
  @ApiProperty({
    type: OrderClientMappingsItem,
    description: 'Array of orders with order client mappings',
  })
  order_client_mappings: ReadonlyArray<OrderClientMappingsItem>;
}

export class GetOrderByClientIdDTO {
  @ApiProperty({
    type: String,
    description: 'Client ID',
  })
  client_id: string;
}

export class GetOrderByClientIDResponse {
  @ApiProperty({
    type: OrderClientMappings,
    description: 'Response with orders',
  })
  data: OrderClientMappings;
}
