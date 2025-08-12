import BaseRepository from "./Base.repository";
import { IAddress } from "../types/location";
import Address from "../models/Address.model";

class AddressRepository extends BaseRepository<IAddress> {
  listForUser(userId: string) {
    return this.find({ user: userId } as any, { lean: true, sort: { createdAt: -1 } });
  }
}

export default new AddressRepository(Address);
