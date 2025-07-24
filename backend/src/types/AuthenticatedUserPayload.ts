import { UserType } from "../utils/constants/UserType.constant";

export interface AuthenticatedUserPayload {
  id: string;
  branch: string;
  branch_abbreviation: string;
  name: string;
  surname: string;
  id_number: string;
  email_address: string;
  mobile_number: string;
  gender: "Male" | "Female";
  password_expiry: Date;
  user_type: UserType;
}
