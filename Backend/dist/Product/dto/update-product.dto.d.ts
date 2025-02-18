export declare enum ProductCategory {
    WOMEN = "women",
    MEN = "men",
    KIDS = "kids"
}
declare class RatingDto {
    rate?: number;
    count?: number;
}
export declare class UpdateProductDto {
    id?: string;
    title?: string;
    category?: ProductCategory;
    image?: string;
    description?: string;
    price?: number;
    quantity?: number;
    rating?: RatingDto;
}
export {};
