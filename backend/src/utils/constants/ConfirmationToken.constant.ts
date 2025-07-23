import dayjs from "dayjs";

export enum ConfirmationTokenType {
  ONE_TIME_PIN = "ONE_TIME_PIN",
  PASSWORD_RESET = "PASSWORD_RESET",
  PASSWORD_FORGOT = "PASSWORD_FORGOT",
}

export const ConfirmationTokenExpiryMap: Record<ConfirmationTokenType, { amount: number; unit: dayjs.ManipulateType }> = {
  [ConfirmationTokenType.ONE_TIME_PIN]: { amount: 5, unit: "minute" },
  [ConfirmationTokenType.PASSWORD_RESET]: { amount: 1, unit: "hour" },
  [ConfirmationTokenType.PASSWORD_FORGOT]: { amount: 1, unit: "day" },
};
