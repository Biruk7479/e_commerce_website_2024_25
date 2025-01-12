import { Document, Types } from 'mongoose';
export declare enum OrderState {
    PENDING = "Pending",
    COMPLETED = "Completed",
    CANCELLED = "Cancelled"
}
export type OrderDocument = Order & Document;
declare class Product {
    productId: Types.ObjectId;
    quantity: number;
}
export declare class Order {
    customerName: string;
    customerEmail: string;
    address: string;
    products: Product[];
    state: OrderState;
    userId: string;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export {};
