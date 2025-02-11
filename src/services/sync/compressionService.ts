
import pako from 'pako';
import { Json, isJson } from './types';

export class CompressionService {
  static async compressData(data: unknown): Promise<{ compressedData: Uint8Array; algorithm: string }> {
    // Validate that data can be safely converted to JSON
    if (!isJson(data)) {
      throw new Error('Invalid data format for compression');
    }

    const jsonString = JSON.stringify(data);
    if (jsonString.length < 1024) { // Don't compress small data
      return { compressedData: new Uint8Array(), algorithm: 'none' };
    }

    const compressed = pako.deflate(jsonString);
    return { compressedData: compressed, algorithm: 'deflate' };
  }

  static async decompressData(compressedData: Uint8Array, algorithm: string): Promise<Json | null> {
    if (algorithm === 'none' || !compressedData.length) {
      return null;
    }

    try {
      const decompressed = pako.inflate(compressedData, { to: 'string' });
      const parsed = JSON.parse(decompressed);
      
      if (!isJson(parsed)) {
        throw new Error('Decompressed data is not valid JSON');
      }
      
      return parsed;
    } catch (error) {
      console.error('Decompression error:', error);
      throw new Error('Failed to decompress data');
    }
  }
}
