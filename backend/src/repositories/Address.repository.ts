import type { Model, HydratedDocument } from "mongoose";
import { Types } from "mongoose";
import AddressModel from "../models/Address.model";
import type { IAddress } from "../models/Address.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type AddressDoc = HydratedDocument<IAddress>;

export class AddressRepository extends GenericRepository<IAddress, AddressDoc> {
  constructor(model: Model<IAddress, any, any, any, AddressDoc> = AddressModel as any) {
    super(model);
  }

  /** Find by human readable address number */
  async findByAddressNo(addressNo: string, opts?: ReadOptions): Promise<AddressDoc | null> {
    return this.findOne({ address_no: addressNo }, opts);
  }

  /** List addresses for a specific user */
  async findByUser(userId: Types.ObjectId | string, opts?: ReadOptions): Promise<AddressDoc[]> {
    return this.findMany({ user_id: userId }, opts);
  }

  /** Search user addresses by partial text across lines and city */
  async searchForUser(
    userId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<AddressDoc>> {
    const filter: any = { user_id: userId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ address_line_01: rx }, { address_line_02: rx }, { suburb: rx }, { city: rx }, { postal_code: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  /** Set the default flag for a user's address, unsetting existing default */
  async setDefault(addressId: Types.ObjectId | string, userId: Types.ObjectId | string, opts?: WriteOptions): Promise<void> {
    await (this as any).model
      .updateMany({ user_id: userId, is_default: true }, { $set: { is_default: false } }, { session: opts?.session ?? undefined })
      .exec();
    await (this as any).model.findByIdAndUpdate(addressId, { $set: { is_default: true } }, { session: opts?.session ?? undefined }).exec();
  }
}

export const addressRepository = new AddressRepository();
