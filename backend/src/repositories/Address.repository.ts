import BaseRepository from "./Base.repository";
import Address from "../models/Address.model";
import { IAddress } from "../types/location";

class AddressRepository extends BaseRepository<IAddress> {
  listForUser(userId: string) {
    return this.find({ user: userId } as any, { sort: { createdAt: -1 } });
  }
}

export default new AddressRepository(Address);
