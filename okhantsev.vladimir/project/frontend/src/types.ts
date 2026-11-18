import type {components} from './schema';

export type Product = components['schemas']['Product'];
export type Order = components['schemas']['Order'];
export type User = components['schemas']['User'];
export type CreateOrderRequest = components['schemas']['CreateOrderRequest'];
export type DeliveryType = CreateOrderRequest['deliveryType'];
export type PaymentType = CreateOrderRequest['paymentType'];

export interface CartItem {
  productId: number;
  quantity: number;
}
