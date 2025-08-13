import { Types } from "mongoose";
import { confirmationTokenRepository } from "../repositories/ConfirmationToken.repository";
import type { IConfirmationToken } from "../models/ConfirmationToken.model";

export class ConfirmationTokenService {
  static async getConfirmationTokenByToken(token: string) {
    return confirmationTokenRepository.findOne({ confirmation_token: token });
  }

  static async getConfirmationTokenByFields(filter: any) {
    return confirmationTokenRepository.findOne(filter);
  }

  static async validateConfirmationToken(token: string) {
    return this.getConfirmationTokenByToken(token);
  }

  static async insertConfirmationToken(data: Partial<IConfirmationToken>) {
    return confirmationTokenRepository.create(data);
  }

  static async updateConfirmationToken(id: string, data: Partial<IConfirmationToken>) {
    return confirmationTokenRepository.updateById(new Types.ObjectId(id), data);
  }
}
