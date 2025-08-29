import jwt, { SignOptions } from "jsonwebtoken";
import { IUser } from "../models/User.model";
import { IBranch } from "../models/Branch.model";
import { AuthenticatedUserPayload } from "../types/AuthenticatedUserPayload";
import dayjs from "dayjs";
import { HttpError } from "./HttpError";
import { StatusCode } from "./constants/StatusCode.constant";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_SECRET_REFRESH_TOKEN as string;

const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new HttpError("JWT_SECRET and JWT_SECRET_REFRESH_TOKEN must be defined in environment variables.", StatusCode.INTERNAL_SERVER_ERROR);
}

export const generateJwtToken = (user: IUser, branch: IBranch): string => {
  const payload: AuthenticatedUserPayload = {
    id: user.id,
    branch: branch.branch_name,
    branch_abbreviation: branch.branch_abbreviation,
    name: user.name,
    surname: user.surname,
    id_number: user.maskIdNumber(),
    email_address: user.email_address,
    mobile_number: user.mobile_number,
    gender: user.gender === "FEMALE" ? "Female" : "Male",
    password_expiry: user.password_expiry,
    user_type: user.user_type,
  };

  const accessTokenOptions: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRY as any };

  return jwt.sign(payload, JWT_SECRET, accessTokenOptions);
};

export const generateRefreshToken = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email_address,
  };

  const refreshTokenOptions: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRY as any };

  return jwt.sign(payload, JWT_REFRESH_SECRET, refreshTokenOptions);
};

const calculateExpiryDate = (expiryString: string): Date => {
  const unit = expiryString.slice(-1);
  const amount = parseInt(expiryString.slice(0, -1));

  const unitsMap: Record<string, dayjs.ManipulateType> = {
    s: "second",
    m: "minute",
    h: "hour",
    d: "day",
    M: "month",
    y: "year",
  };

  const dayjsUnit = unitsMap[unit];
  if (!dayjsUnit || isNaN(amount)) {
    throw new HttpError(`Invalid expiry format: ${expiryString}`, StatusCode.INTERNAL_SERVER_ERROR);
  }

  return dayjs().add(amount, dayjsUnit).toDate();
};

export const getAccessTokenExpiry = (): Date => calculateExpiryDate(ACCESS_TOKEN_EXPIRY);
export const getRefreshTokenExpiry = (): Date => calculateExpiryDate(REFRESH_TOKEN_EXPIRY);
