import dayjs from "dayjs";

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
