
import pako from 'pako';

export class CompressionService {
  static async compressData(data: any): Promise<{ compressedData: Uint8Array; algorithm: string }> {
    const jsonString = JSON.stringify(data);
    if (jsonString.length < 1024) { // Don't compress small data
      return { compressedData: new Uint8Array(), algorithm: 'none' };
    }

    const compressed = pako.deflate(jsonString);
    return { compressedData: compressed, algorithm: 'deflate' };
  }

  static async decompressData(compressedData: Uint8Array, algorithm: string): Promise<any> {
    if (algorithm === 'none' || !compressedData.length) {
      return null;
    }

    const decompressed = pako.inflate(compressedData, { to: 'string' });
    return JSON.parse(decompressed);
  }
}
