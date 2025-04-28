// services/s3-upload.service.ts
import { Injectable } from '@angular/core';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class S3UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // AWS Configuration - REPLACE THESE VALUES with your actual AWS details
    const awsRegion = 'us-east-1'; // Your AWS region
    this.bucketName = 'your-bucket-name'; // Your S3 bucket name
    
    // Initialize S3 client
    this.s3Client = new S3Client({
      region: awsRegion,
      // IMPORTANT: Replace with your actual AWS credentials or use other authentication methods
      credentials: {
        accessKeyId: 'YOUR_AWS_ACCESS_KEY',
        secretAccessKey: 'YOUR_AWS_SECRET_KEY'
      }
    });
  }

  /**
   * Upload a file to S3 bucket
   * @param file File buffer to upload
   * @param fileName Name to use for the file in S3
   * @param contentType MIME type of the file
   * @returns Observable that completes when upload is done
   */
  uploadToS3(file: ArrayBuffer, fileName: string, contentType: string): Observable<any> {
    // Create an upload task
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: fileName,
        Body: file,
        ContentType: contentType
      }
    });

    // Return an observable that completes when the upload is done
    return from(upload.done());
  }
}