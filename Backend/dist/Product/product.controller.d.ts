import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileUploadService } from './file-upload/file-upload.service';
export declare class ProductController {
    private readonly productService;
    private readonly fileUploadService;
    constructor(productService: ProductService, fileUploadService: FileUploadService);
    create(createProductDto: CreateProductDto, file: Express.Multer.File): Promise<import("./schemas/product.schema").Product>;
    findAll(): Promise<import("./schemas/product.schema").Product[]>;
    getCategories(): Promise<string[]>;
    findByCategory(category: string): Promise<import("./schemas/product.schema").Product[]>;
    findOne(id: string): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("./schemas/product.schema").Product>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product> & import("./schemas/product.schema").Product & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
