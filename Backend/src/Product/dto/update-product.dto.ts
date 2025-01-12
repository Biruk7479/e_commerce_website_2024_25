// /* eslint-disable prettier/prettier */
// import {IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
// import { ProductCategory } from './enum/ProductCategory';



// export class UpdateProductDto {

//  @IsNotEmpty()
//  @IsString()
//  id?: string;

//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsEnum(ProductCategory)
//   category?: ProductCategory;

//   @IsOptional()
//   @IsString()
//   image?: string;

//   @IsOptional()
//   @IsNumber()
//   oldPrice?: number;

//   @IsOptional()
//   @IsNumber()
//   newPrice?: number;

//   @IsOptional()
//   @IsNumber()
//   quantity?: number;
// }
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductCategory {
  WOMEN = 'women',
  MEN = 'men',
  KIDS = 'kids',
}

class RatingDto {
  @IsOptional()
  @IsNumber()
  rate?: number;

  @IsOptional()
  @IsNumber()
  count?: number;
}

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string; // Updated from "name" to "title"

  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number; // Replaced oldPrice and newPrice with a single "price" field

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ValidateNested()
  @Type(() => RatingDto)
  @IsOptional()
  rating?: RatingDto; // Added nested rating field
}