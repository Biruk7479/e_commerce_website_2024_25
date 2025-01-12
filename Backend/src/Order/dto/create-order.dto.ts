import { IsString, IsEmail, IsNotEmpty, IsArray, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderState } from '../schema/order.schema'; // Import OrderState enum
import { Types } from 'mongoose'; // Correct import for ObjectId

class ProductDto {
  @IsNotEmpty()
  productId: Types.ObjectId;  // Use ObjectId type for productId

  @IsNotEmpty()
  quantity: number;
}


export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsString()
  @IsNotEmpty()
  userId: string;  // Assuming userId is a string

  // Optional field for state, defaults to 'Pending' if not provided
  @IsEnum(OrderState)
  @IsOptional() // Optional because the default is 'Pending' in the schema
  state?: OrderState; // state can be either 'Pending', 'Completed', or 'Cancelled'
}
