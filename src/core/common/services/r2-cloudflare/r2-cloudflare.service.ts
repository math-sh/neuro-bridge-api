import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
@Injectable()
export class R2CloudflareService {
  private readonly s3: S3Client;
  private readonly bucketName: string = 'osfy'; // Substitua pelo nome do bucket

  constructor() {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint:
        'https://34807a9489dacb976811e5219c99f4fb.r2.cloudflarestorage.com/', // Substitua pelo endpoint do bucket
      credentials: {
        accessKeyId: '9b86a242250d25fd45af0c72f5982008', // Substitua pela sua Access Key ID
        secretAccessKey:
          '2a440e89c6c2965237920f6622758958de6799327821dddbcfec02e02a380100', // Substitua pela sua Secret Access Key
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
    } catch (error) {
      throw new Error(error);
    }

    const url = `https://bucket.osfy.ossbrasil.com.br/${key}`;

    return url;
  }
  async uploadDocuments(file: Express.Multer.File): Promise<string> {
    const key = `${randomUUID()}_${file.originalname}`;
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      return `https://bucket.osfy.ossbrasil.com.br/${key}`;
    } catch (error) {
      throw new Error(error);
    }
  }
}
