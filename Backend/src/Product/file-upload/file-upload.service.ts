import { Injectable } from '@nestjs/common';
import { extname } from 'path'; // Import extname from the Node.js path module

@Injectable()
export class FileUploadService {
  validateFileType(file: Express.Multer.File): boolean {
    // Allowed file extensions
    const allowedFileTypes = /\.(jpg|jpeg|png|gif)$/i;

    // Extract the file extension
    const fileExt = extname(file.originalname).toLowerCase();

    // Validate the file extension
    return allowedFileTypes.test(fileExt);
  }
}
