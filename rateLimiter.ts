/**
 * In-Memory Sliding Window Login Rate Limiter.
 * Protects against brute-force attacks on administrator credentials.
 */

interface RateLimitRecord {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil: number | null;
}

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const BLOCK_DURATION_MS = 15 * 60 * 1000; // Block for 15 minutes if exceeded

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Check if the given client IP is currently rate-limited.
 */
export function isLoginRateLimited(clientIp: string): { blocked: boolean; remainingSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  if (!record) {
    return { blocked: false };
  }

  // Check if active block period
  if (record.blockedUntil && now < record.blockedUntil) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { blocked: true, remainingSeconds };
  }

  // Reset if window has elapsed
  if (now - record.firstAttemptTime > WINDOW_MS) {
    rateLimitMap.delete(clientIp);
    return { blocked: false };
  }

  return { blocked: false };
}

/**
 * Record a failed authentication attempt for a given client IP.
 */
export function recordFailedLoginAttempt(clientIp: string): { blocked: boolean; remainingAttempts: number; blockDurationMinutes?: number } {
  const now = Date.now();
  let record = rateLimitMap.get(clientIp);

  if (!record || now - record.firstAttemptTime > WINDOW_MS) {
    record = {
      attempts: 1,
      firstAttemptTime: now,
      blockedUntil: null,
    };
    rateLimitMap.set(clientIp, record);
    return { blocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
  }

  record.attempts += 1;

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return { blocked: true, remainingAttempts: 0, blockDurationMinutes: 15 };
  }

  return { blocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - record.attempts };
}

/**
 * Clear failed attempts for a client IP upon successful authentication.
 */
export function clearLoginRateLimit(clientIp: string): void {
  rateLimitMap.delete(clientIp);
}

