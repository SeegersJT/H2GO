import { FilterQuery } from "mongoose";
import { IAddress } from "../models/Address.model";

import { AddressRepository } from "../repositories/Address.repository";

export class AddressService {
  static getAllAddresses = async () => {
    return await AddressRepository.findAllAddresses();
  };

  static getAddressById = async (id: string) => {
    return await AddressRepository.findAddressById(id);
  };

  static getAddressByFields = async (params: FilterQuery<IAddress>) => {
    return await AddressRepository.findAddressByFields(params);
  };

  static insertAddress = async (addressData: Partial<IAddress>): Promise<IAddress> => {
    return await AddressRepository.insertAddress(addressData);
  };

  static updateAddress = async (id: string, updateData: Partial<IAddress>): Promise<IAddress | null> => {
    return AddressRepository.updateAddressById(id, updateData);
  };

  static softDeleteAddress = async (id: string, updatedBy: string) => {
    return await AddressRepository.softDeleteAddressById(id, updatedBy);
  };
}
