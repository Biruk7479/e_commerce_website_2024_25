// /* eslint-disable prettier/prettier */
// import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
// import { ProductCategory } from './enum/ProductCategory';

// export class CreateProductDto {
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @IsNotEmpty()
//   @IsEnum(ProductCategory)
//   category: ProductCategory;

//   @IsNotEmpty()
//   @IsString()
//   image: string;

  
//   @IsNumber()
//   oldPrice: number;

 
//   @IsNumber()
//   newPrice: number;

 
//   @IsNumber()
//   quantity: number;
// }
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductCategory {
  WOMEN = 'women',
  MEN = 'men',
  KIDS = 'kids',
}

class RatingDto {
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @IsNotEmpty()
  @IsNumber()
  count: number;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string; // Changed from "name" to "title" for consistency with schema

  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  description: string; // Added to match the schema

  @IsNotEmpty()
  @IsNumber()
  price: number; // Combined oldPrice and newPrice into "price" for simplicity

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ValidateNested()
  @Type(() => RatingDto)
  rating: RatingDto; // Added nested rating field
}