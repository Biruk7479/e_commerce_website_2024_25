import { OrderState } from '../schema/order.schema';
import { Types } from 'mongoose';
declare class ProductDto {
    productId: Types.ObjectId;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerEmail: string;
    address: string;
    products: ProductDto[];
    userId: string;
    state?: OrderState;
}
export {};
