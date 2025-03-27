import * as CryptoJS from 'crypto-js';

export class EncryptionHelper {
  private static key = CryptoJS.enc.Utf8.parse('3Zp9L7rQ2d6R8vXcW1m4SjF9KnPbQ8uY');
  private static iv = CryptoJS.enc.Utf8.parse('G5d3T9jK1mP8L4qV');

  public static encrypt(plainText: string): string {
    const encrypted = CryptoJS.AES.encrypt(plainText, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  public static decrypt(cipherText: string): string {
    const decrypted = CryptoJS.AES.decrypt(cipherText, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
