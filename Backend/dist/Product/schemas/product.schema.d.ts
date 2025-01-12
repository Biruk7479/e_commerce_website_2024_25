import { Document } from 'mongoose';
declare class Rating {
    rate: number;
    count: number;
}
export declare class Product extends Document {
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: Rating;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
export {};
