import crypto from 'crypto';
import NovitConfig from './config';

/**
 * NovIT Encryption utility
 * TypeScript equivalent of PHP Encryption class from WordPress plugin
 * Migrated from api-integration/lib/encryption.ts
 */
export class NovitEncryption {
  private encryptMethod: string;
  private secretKey: string;
  private secretIv: string;
  private hashAlgo: string;
  private key: string;
  private iv: string;

  constructor() {
    const config = NovitConfig.getInstance().getEncryptionConfig();
    
    this.encryptMethod = 'aes-256-cbc';
    this.secretKey = config.secretKey;
    this.secretIv = config.secretIv;
    this.hashAlgo = config.hashAlgo;
    
    // Genereeri võti ja IV sama moodi nagu PHP versioonis
    this.key = crypto.createHash(this.hashAlgo).update(this.secretKey).digest('hex');
    this.iv = crypto.createHash('sha256').update(this.secretIv).digest('hex').substring(0, 16);
  }

  /**
   * Krüpteeri string (analoogne PHP encrypt meetodile)
   */
  public encrypt(text: string): string {
    if (!text || text.trim() === '') {
      return text;
    }

    try {
      const cipher = crypto.createCipher(this.encryptMethod, this.key);
      cipher.setAutoPadding(true);
      
      let encrypted = cipher.update(text, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Dekrüpteeri string (analoogne PHP decrypt meetodile)
   */
  public decrypt(encryptedText: string): string {
    if (!encryptedText || encryptedText.trim() === '') {
      return encryptedText;
    }

    try {
      const decipher = crypto.createDecipher(this.encryptMethod, this.key);
      decipher.setAutoPadding(true);
      
      let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Loo hash (analoogne PHP getHash meetodile)
   */
  public getHash(text: string): string {
    if (!text) {
      return '';
    }

    try {
      return crypto.createHash(this.hashAlgo).update(text).digest('hex');
    } catch (error) {
      console.error('Hash error:', error);
      throw new Error('Failed to create hash');
    }
  }

  /**
   * Kontrolli kas krüpteeritud tekst on kehtiv
   */
  public isValidEncryption(encryptedText: string): boolean {
    if (!encryptedText) {
      return false;
    }

    try {
      this.decrypt(encryptedText);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Genereeri juhuslik string
   */
  public generateRandomString(length: number = 32): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }
}

export default NovitEncryption;
