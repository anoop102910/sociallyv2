import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly logger = new Logger(MinioService.name);

  async onModuleInit() {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minioadmin',
      secretKey: 'minioadmin123',
    });

    await this.createBucket('posts');
  }

  async createBucket(bucketName: string) {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        this.logger.log(`Bucket ${bucketName} created successfully.`);
      } else {
        this.logger.log(`Bucket ${bucketName} already exists.`);
      }
    } catch (err) {
      this.logger.log('Error creating bucket.', err);
    }
  }

  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      await this.minioClient.putObject(
        bucketName,
        file.originalname,
        file.buffer,
        file.size,
      );

      const url = await this.minioClient.presignedUrl(
        'GET',
        bucketName,
        file.originalname,
        24 * 60 * 60,
      );
      return url;
    } catch (err) {
      throw err;
    }
  }
}
