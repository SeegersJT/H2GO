import { Types } from "mongoose";
import { addressRepository } from "../repositories/Address.repository";
import { IAddress } from "../models/Address.model";

export class AddressService {
  static async getAllAddresses() {
    return addressRepository.findMany({});
  }

  static async getAddressbyId(id: string) {
    return addressRepository.findById(new Types.ObjectId(id));
  }

  static async insertAddress(data: Partial<IAddress>, actorId?: string) {
    return addressRepository.create(data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async updateAddress(id: string, data: Partial<IAddress>, actorId?: string) {
    return addressRepository.updateById(new Types.ObjectId(id), data, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }

  static async deleteAddress(id: string, actorId?: string) {
    return addressRepository.updateById(new Types.ObjectId(id), { active: false }, actorId ? { actorId: new Types.ObjectId(actorId) } : undefined);
  }
}
