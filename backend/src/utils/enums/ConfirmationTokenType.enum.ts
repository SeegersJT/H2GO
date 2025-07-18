export enum ConfirmationTokenType {
    ONE_TIME_PIN = 'ONE_TIME_PIN',
    PASSWORD_RESET = 'PASSWORD_RESET',
    FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

export const OTP_EXPIRY = 5 * 60 * 1000;