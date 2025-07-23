export const RegexPatterns = {
  VALIDATE_NAME: /^[A-Z][a-z]+$/,
  VALIDATE_SURNAME: /^[A-Z][a-z]+(?:-[A-Z][a-z]+)*$/,
  VALIDATE_EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  VALIDATE_MOBILE_SOUTH_AFRICA: /^(?:\+27|27|0)[6-8][0-9]{8}$/,
  VALIDATE_GENDER: /^(Male|Female)$/,
  VALIDATE_ID_SOUTH_AFRICA: /^\d{13}$/, // RSA 13-digit ID
};
