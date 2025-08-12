import { ObjectId } from "./core";
import dayjs from "dayjs";

export enum UserType {
  DEVELOPER = "DEVELOPER",
  SUPER_USER = "SUPER_USER",
  ADMIN = "ADMIN",
  FINANCE = "FINANCE",
  BRANCH_ADMIN = "BRANCH_ADMIN",
  BRANCH_FINANCE = "BRANCH_FINANCE",
  DRIVER = "DRIVER",
  CUSTOMER = "CUSTOMER",
}

export const UserTypeHierarchy: UserType[] = [
  UserType.DEVELOPER,
  UserType.SUPER_USER,
  UserType.ADMIN,
  UserType.FINANCE,
  UserType.BRANCH_ADMIN,
  UserType.BRANCH_FINANCE,
  UserType.DRIVER,
  UserType.CUSTOMER,
];

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";

export interface IUser {
  _id: ObjectId;
  email: string;
  phone?: string;

  passwordHash?: string;
  lastPasswordChangeAt?: Date;
  passwordExpiresAt?: Date;
  failedLoginAttempts?: number;
  lockedUntil?: Date;

  firstName: string;
  lastName: string;
  gender?: Gender;
  dateOfBirth?: Date;
  avatarUrl?: string;

  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  confirmed?: boolean;

  userType: UserType;
  isActive: boolean;
  branch?: ObjectId;

  metadata?: Record<string, any>;
}

export enum ConfirmationTokenType {
  OTP_LOGIN_TOKEN = "OTP_LOGIN_TOKEN",
  OTP_CONFIRM_LOGIN_TOKEN = "OTP_CONFIRM_LOGIN_TOKEN",
  OTP_PASSWORD_EXPIRED_TOKEN = "OTP_PASSWORD_EXPIRED_TOKEN",
  OTP_PASSWORD_FORGOT_TOKEN = "OTP_PASSWORD_FORGOT_TOKEN",
  PASSWORD_RESET_TOKEN = "PASSWORD_RESET_TOKEN",
}

export const ConfirmationTokenExpiryMap: Record<ConfirmationTokenType, { amount: number; unit: dayjs.ManipulateType }> = {
  [ConfirmationTokenType.OTP_LOGIN_TOKEN]: { amount: 5, unit: "minute" },
  [ConfirmationTokenType.OTP_CONFIRM_LOGIN_TOKEN]: { amount: 5, unit: "minute" },
  [ConfirmationTokenType.OTP_PASSWORD_EXPIRED_TOKEN]: { amount: 5, unit: "minute" },
  [ConfirmationTokenType.OTP_PASSWORD_FORGOT_TOKEN]: { amount: 2, unit: "hour" },
  [ConfirmationTokenType.PASSWORD_RESET_TOKEN]: { amount: 5, unit: "minute" },
};

export interface IConfirmationToken {
  _id: ObjectId;
  user: ObjectId;
  token: string;
  type: ConfirmationTokenType;
  otpCode?: string;
  otpAttempts?: number;
  expiresAt: Date;
  usedAt?: Date;
  context?: Record<string, any>;
}
