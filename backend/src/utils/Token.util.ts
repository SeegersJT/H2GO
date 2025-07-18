import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not defined in environment variables');
}

const accessOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] };
const refreshOptions: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] };

interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, accessOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, refreshOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
};

export const refreshAccessTokenIfNeeded = (accessToken: string, refreshToken: string): {
  newAccessToken?: string;
  payload?: TokenPayload;
  valid: boolean;
  reason?: string;
} => {
  try {
    const payload = verifyAccessToken(accessToken);
    return { payload, valid: true };
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      try {
        const payload = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(payload);
        return { newAccessToken, payload, valid: true };
      } catch (refreshErr) {
        return { valid: false, reason: 'Refresh token expired or invalid' };
      }
    }
    return { valid: false, reason: 'Invalid access token' };
  }
};
