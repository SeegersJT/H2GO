import { FilterQuery } from "mongoose";
import Address, { IAddress } from "../models/Address.model";

export class AddressRepository {
  static findAllAddresses = async (): Promise<IAddress[]> => {
    return await Address.find({ active: true });
  };

  static findAddressById = async (id: string): Promise<IAddress | null> => {
    return await Address.findById({ _id: id, active: true });
  };

  static findAddressByFields = async (params: FilterQuery<IAddress>): Promise<IAddress | null> => {
    return await Address.findOne(params);
  };

  static insertAddress = async (addressData: Partial<IAddress>): Promise<IAddress> => {
    return await Address.create(addressData);
  };

  static updateAddressById = async (id: string, updateData: Partial<IAddress>): Promise<IAddress | null> => {
    return Address.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      upsert: false,
    });
  };

  static softDeleteAddressById = async (id: string, updatedBy: string) => {
    return Address.findByIdAndUpdate(
      id,
      { active: false, updatedBy: updatedBy },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  };
}
