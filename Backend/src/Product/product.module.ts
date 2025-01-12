import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { FileUploadService } from './file-upload/file-upload.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        AuthModule, // Import AuthModule here
    ],
    controllers: [ProductController],
    providers: [ProductService, FileUploadService],
})
export class ProductModule {}
