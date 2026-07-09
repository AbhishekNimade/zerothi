// Simple in-memory cache for phone OTP verification
// Shares active OTPs between API routes on the server side

interface OtpEntry {
  code: string;
  expires: number;
}

if (!(global as any).otpCache) {
  (global as any).otpCache = new Map<string, OtpEntry>();
}

export const otpCache: Map<string, OtpEntry> = (global as any).otpCache;
