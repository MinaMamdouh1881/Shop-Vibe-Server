import crypto from 'crypto';

export function createSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt: string): string {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return derivedKey.toString('hex');
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password hashing failed');
  }
}
