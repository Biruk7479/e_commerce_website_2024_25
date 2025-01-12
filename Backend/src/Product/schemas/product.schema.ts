// /* eslint-disable prettier/prettier */
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose'; // <-- Add this import

// @Schema()
// export class Product extends Document {
//   @Prop({ required: true })
//   name: string;

//   @Prop()
//   description: string;

//   @Prop({ required: true })
//   price: number;

//   @Prop()
//   image: string;

//   @Prop()
//   category: string;
// }

// export const ProductSchema = SchemaFactory.createForClass(Product);
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class Rating {
  @Prop({ required: true, min: 0 })
  rate: number;

  @Prop({ required: true, min: 0 })
  count: number;
}

@Schema()
export class Product extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({
    required: true,
    enum: ['women', 'men', 'kids'],
  })
  category: string;

  @Prop({ type: Rating, required: true })
  rating: Rating;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
