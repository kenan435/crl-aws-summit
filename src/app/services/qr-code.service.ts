import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  constructor() {}
  
  /**
   * Generates a QR code data URL from a given URL string
   * @param url The URL to encode in the QR code
   * @returns Promise resolving to a data URL for the QR code image
   */
  async generateQRCode(url: string): Promise<string> {
    try {
      // Generate QR code as a data URL
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H', // High error correction for better scanning
        margin: 1,                 // Margin around the QR code
        width: 300,                // Width of the QR code in pixels
        color: {
          dark: '#000000',         // Black dots
          light: '#FFFFFF'         // White background
        }
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
      throw err;
    }
  }
}