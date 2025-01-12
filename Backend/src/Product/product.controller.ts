import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileUploadService } from './file-upload/file-upload.service'; // Import your file upload service
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileUploadService: FileUploadService, // Inject the file upload service
  ) {}
  
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
 
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = './uploads/products'; // Define a clear and valid path for your uploads
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    // Validate file type
    if (file && !this.fileUploadService.validateFileType(file)) {
      throw new HttpException('Invalid file type. Only image files are allowed', HttpStatus.BAD_REQUEST);
    }
  
    // Set image field if file is uploaded
    if (file) {
      createProductDto.image = `/uploads/products/${file.filename}`;
    }
  
    return this.productService.create(createProductDto);
  }
  
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get('/categories')
  async getCategories(): Promise<string[]> {
    return this.productService.getCategories();
  }

  @Get('/category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.productService.findByCategory(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
