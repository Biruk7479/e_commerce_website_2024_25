import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export enum OrderState {
  PENDING = 'Pending',     // Order has been placed but not yet completed
  COMPLETED = 'Completed', // Order has been completed and fulfilled
  CANCELLED = 'Cancelled', // Order has been cancelled
}

export type OrderDocument = Order & Document;

@Schema()
class Product {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId; // Reference to the Product schema

  @Prop({ required: true })
  quantity: number; // Product quantity
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [Product], required: true })
  products: Product[]; // List of products in the order

  @Prop({ type: String, enum: OrderState, default: OrderState.PENDING })
  state: OrderState; // Order state (Pending, Completed, Cancelled)

  @Prop({ required: true })
  userId: string; // Reference to the user who placed the order
}

export const OrderSchema = SchemaFactory.createForClass(Order);
