import crypto from 'crypto';
import { type Request, type Response, type NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'sagar_portfolio_secure_admin_jwt_secret_2026';

export interface AdminTokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  adminUser?: AdminTokenPayload;
}

/**
 * Hash password with salt using PBKDF2 (SHA-512 with 100,000 iterations).
 */
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, chosenSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: chosenSalt };
}

/**
 * Verify a plaintext password against the stored salt and hash.
 */
export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

/**
 * Generate a cryptographically signed authentication token.
 * Token format: base64(payload).signature
 */
export function generateAdminToken(payload: Omit<AdminTokenPayload, 'exp'>, expiresInHours: number = 24): string {
  const fullPayload: AdminTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInHours * 3600,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify and decode an authentication token.
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadBase64, providedSig] = parts;
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payloadBase64).digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(providedSig), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: AdminTokenPayload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Express middleware to protect administrative routes.
 */
export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required.',
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const verified = verifyAdminToken(token);

  if (!verified) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired authentication token. Please log in again.',
    });
    return;
  }

  req.adminUser = verified;
  next();
}

