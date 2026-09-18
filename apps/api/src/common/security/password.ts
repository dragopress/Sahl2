import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEYLEN = 64;

/**
 * Hashes a password using scrypt with a random salt.
 * @param password - The plaintext password to hash
 * @returns A promise that resolves to the encoded hash in the format "scrypt$salt$hash"
 */
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = (await scrypt(password, salt, KEYLEN)) as Buffer;
  return `scrypt$${salt}$${key.toString('hex')}`;
}

/**
 * Verifies a password against an encoded scrypt hash using a timing-safe comparison.
 * @param password - The plaintext password to verify
 * @param encoded - The encoded hash string in the format "scrypt$salt$hash"
 * @returns A promise that resolves to true if the password matches, false otherwise
 */
export async function verifyPassword(password: string, encoded: string) {
  const [scheme, salt, hex] = encoded.split('$');

  if (scheme !== 'scrypt' || !salt || !hex) {
    return false;
  }

  const key = (await scrypt(password, salt, KEYLEN)) as Buffer;

  try {
    return timingSafeEqual(key, Buffer.from(hex, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Returns the SHA-256 hex digest of a token.
 * @param token - The token string to hash
 * @returns The hexadecimal SHA-256 hash of the token
 */
export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a high-entropy random token.
 * @returns A base64url-encoded random token string (32 bytes of entropy)
 */
export function createToken() {
  return randomBytes(32).toString('base64url');
}
