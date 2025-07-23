import crypto from "crypto";
import { ConfirmationTokenExpiryMap, ConfirmationTokenType } from "./constants/ConfirmationToken.constant";
import dayjs from "dayjs";
import { IUser } from "../models/User.model";

export class Utils {
  /**
   * Generate a formatted ID string: CATEGORY-BRANCH-NUMBER
   * @param category The category of the ID (e.g. "USER", "ORDER")
   * @param branchAbbreviation The branch abbreviation (e.g. "H2GO", "WTBY")
   * @param number The numerical part to pad
   * @returns A string like "CATEGORY-BRANCH-0001"
   */
  static generateID(category: string, branchAbbreviation: string, number: number): string {
    const paddedNumber = String(number).padStart(4, "0");
    return `${category.toUpperCase()}-${branchAbbreviation.toUpperCase()}-${paddedNumber}`;
  }

  /**
   * Normalize a mobile number by ensuring it includes the country dial code prefix.
   * @param mobile The input mobile number string (may include spaces, +, 0 etc.)
   * @param countryDialCode The numeric country dial code (e.g. 27 for South Africa)
   * @returns The mobile number in international format with plus sign, e.g. "+27123456789"
   */
  static normalizeMobileNumber(mobile: string, countryDialCode: number): string {
    let normalized = mobile.replace(/\D/g, "");

    if (normalized.startsWith("0")) {
      normalized = normalized.substring(1);
    }

    const dialCodeStr = countryDialCode.toString();

    if (!normalized.startsWith(dialCodeStr)) {
      normalized = dialCodeStr + normalized;
    }

    return "+" + normalized;
  }

  /**
   * Generate a secure numeric confirmation token in block format.
   * @param blocks Number of blocks (default: 4)
   * @param digitsPerBlock Number of digits per block (default: 4)
   * @returns A token like "5489-1595-1574-8459"
   */
  static generateSecureConfirmationToken(blocks = 5, digitsPerBlock = 4): string {
    const blocksArray: string[] = [];

    for (let i = 0; i < blocks; i++) {
      const buffer = crypto.randomBytes(2);
      const number = buffer.readUInt16BE() % Math.pow(10, digitsPerBlock);
      const padded = number.toString().padStart(digitsPerBlock, "0");
      blocksArray.push(padded);
    }

    return blocksArray.join("-");
  }

  /**
   * Returns the expiry date for a confirmation token based on its type.
   * @param type The confirmation token type
   * @returns A Date object representing the expiry time
   */
  static getConfirmationTokenExpiry(type: ConfirmationTokenType): Date {
    const { amount, unit } = ConfirmationTokenExpiryMap[type];
    return dayjs().add(amount, unit).toDate();
  }

  /**
   * Remove sensitive fields from user object before returning to client.
   * Currently removes password field.
   * @param user - Mongoose User document
   * @returns Sanitized user object
   */
  static sanitizeUser = (user: IUser): Partial<IUser> => {
    const obj = user.toObject();
    delete obj.password;
    return obj;
  };
}
