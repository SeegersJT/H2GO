import { Types } from "mongoose";
import { addressRepository } from "../repositories/Address.repository";

export class AddressService {
  static async getAllAddresses() {
    return addressRepository.findMany({});
  }

  static async getAddressbyId(id: string) {
    return addressRepository.findById(new Types.ObjectId(id));
  }
}
