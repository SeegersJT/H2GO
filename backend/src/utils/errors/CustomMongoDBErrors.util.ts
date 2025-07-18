import { StatusCode, StatusCodeType } from "../constants/StatusCode.constant";


interface MongoParsedError {
  message: string;
  code: StatusCodeType;
}

export const parseMongoError = (err: any): MongoParsedError | null => {
  if (err?.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0];

    const fieldMap: Record<string, string> = {
      email_address: 'Email address',
      id_number: 'ID number',
    };

    const userFriendlyField = fieldMap[duplicateField] || duplicateField;

    return {
      message: `${userFriendlyField} already exists.`,
      code: StatusCode.CONFLICT,
    };
  }

  if (err?.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');

    return {
      message: messages,
      code: StatusCode.BAD_REQUEST,
    };
  }

  return null;
};
