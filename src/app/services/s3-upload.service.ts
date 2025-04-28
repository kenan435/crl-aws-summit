import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable({
  providedIn: 'root'
})
export class S3UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    // Replace these with your actual S3 details
    this.region = 'us-east-1'; 
    this.bucketName = 'your-aws-summit-quiz-bucket'; 
    
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: 'YOUR_ACCESS_KEY_ID',
        secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
      }
    });
  }

  async uploadPdfBlob(pdfBlob: Blob, userId: string): Promise<string> {
    try {
      // Convert blob to array buffer
      const arrayBuffer = await pdfBlob.arrayBuffer();
      
      // Create a unique filename with user ID and timestamp
      const fileName = `quiz-result-\${userId}-\${Date.now()}.pdf`;
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: new Uint8Array(arrayBuffer),
        ContentType: 'application/pdf',
        ContentDisposition: 'attachment; filename="aws-summit-quiz-results.pdf"',
        CacheControl: 'max-age=86400'
      });
      
      await this.s3Client.send(command);
      
      // Return a signed URL that works for mobile devices
      return this.getSignedDownloadUrl(fileName);
    } catch (err) {
      console.error('Error uploading to S3:', err);
      throw err;
    }
  }
  
  async getSignedDownloadUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileName
    });
    
    // URL valid for 7 days
    return getSignedUrl(this.s3Client, command, { expiresIn: 604800 });
  }
}