// src/cloudinary/cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
const streamifier = require('streamifier');
type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    buffer: Buffer,
    width = 1000,
    location = 'product',
  ): Promise<CloudinaryResponse> {
    try {
      return new Promise((resolve, reject) => {
        const cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: `${location}/uploads`,
            format: 'webp',
            width,
          },
          (error: any, result: CloudinaryResponse) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              console.log(result);
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getPublicIdFromUrl(imageUrl: string): string {
    const parts = imageUrl.split('/');
    return parts[parts.length - 1].split('.')[0];
  }

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: `${location}/uploads`,
          format: 'webp',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(public_id: string) {
    return cloudinary.uploader.destroy(public_id);
  }
}
