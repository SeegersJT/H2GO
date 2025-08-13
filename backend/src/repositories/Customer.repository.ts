import type { Model, HydratedDocument, AnyKeys } from "mongoose";
import { Types } from "mongoose";
import CustomerModel from "../models/Customer.model";
import type { ICustomer } from "../models/Customer.model";
import { GenericRepository, PaginateResult, ReadOptions, WriteOptions } from "./Generic.repository";

export type CustomerDoc = HydratedDocument<ICustomer>;

function normEmail(email: string) {
  return email.trim().toLowerCase();
}
function normPhone(phone: string) {
  return phone.replace(/\D+/g, ""); // digits-only to match model setter
}

export class CustomerRepository extends GenericRepository<ICustomer, CustomerDoc> {
  constructor(model: Model<ICustomer, any, any, any, CustomerDoc> = CustomerModel as any) {
    super(model);
  }

  /** Find by human code (customer_no) */
  async findByCustomerNo(customerNo: string, opts?: ReadOptions): Promise<CustomerDoc | null> {
    return this.findOne({ customer_no: customerNo }, opts);
  }

  /** Find by email (normalized) within a branch (optional) */
  async findByEmail(email: string, branchId?: Types.ObjectId | string, opts?: ReadOptions): Promise<CustomerDoc | null> {
    const filter: any = { email: normEmail(email) };
    if (branchId) filter.branch_id = branchId;
    return this.findOne(filter, opts);
  }

  /** Find by phone (digits-only) within a branch (optional) */
  async findByPhone(phone: string, branchId?: Types.ObjectId | string, opts?: ReadOptions): Promise<CustomerDoc | null> {
    const filter: any = { phone: normPhone(phone) };
    if (branchId) filter.branch_id = branchId;
    return this.findOne(filter, opts);
  }

  /** List customers in a branch (respects includeInactive from ReadOptions) */
  async findByBranch(branchId: Types.ObjectId | string, opts?: ReadOptions): Promise<CustomerDoc[]> {
    return this.findMany({ branch_id: branchId }, opts);
  }

  /** Quick exact name lookup (case-insensitive collation handled by model index) */
  async findByNameExact(branchId: Types.ObjectId | string, name: string, opts?: ReadOptions): Promise<CustomerDoc | null> {
    return this.findOne({ branch_id: branchId, name }, opts);
  }

  /** Search & paginate customers in a branch across name/email/phone/customer_no/tags */
  async searchInBranch(
    branchId: Types.ObjectId | string,
    q: string | undefined,
    opts?: ReadOptions & { page?: number; pageSize?: number }
  ): Promise<PaginateResult<CustomerDoc>> {
    const filter: any = { branch_id: branchId };
    if (q && q.trim()) {
      const s = q.trim();
      const rx = new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { customer_no: rx }, { tags: rx }];
    }
    return this.paginate(filter, { ...opts, sort: opts?.sort ?? { createdAt: -1 } });
  }

  /** Set default address for a customer */
  async setDefaultAddress(
    customerId: Types.ObjectId | string,
    addressId: Types.ObjectId | string | null,
    opts?: WriteOptions
  ): Promise<CustomerDoc | null> {
    return (this as any).model
      .findByIdAndUpdate(customerId, { $set: { default_address_id: addressId } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** Add tags (de-duplicates) */
  async addTags(customerId: Types.ObjectId | string, tags: string[], opts?: WriteOptions): Promise<CustomerDoc | null> {
    const clean = tags.map((t) => t.trim()).filter(Boolean);
    if (!clean.length) return this.findById(customerId);
    return (this as any).model
      .findByIdAndUpdate(customerId, { $addToSet: { tags: { $each: clean } } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** Remove tags */
  async removeTags(customerId: Types.ObjectId | string, tags: string[], opts?: WriteOptions): Promise<CustomerDoc | null> {
    const clean = tags.map((t) => t.trim()).filter(Boolean);
    if (!clean.length) return this.findById(customerId);
    return (this as any).model
      .findByIdAndUpdate(customerId, { $pull: { tags: { $in: clean } } }, { new: true, session: opts?.session ?? undefined })
      .exec();
  }

  /** Activate/deactivate customer explicitly (soft delete still available via deleteById) */
  async setActive(customerId: Types.ObjectId | string, active: boolean, opts?: WriteOptions): Promise<CustomerDoc | null> {
    return (this as any).model.findByIdAndUpdate(customerId, { $set: { active } }, { new: true, session: opts?.session ?? undefined }).exec();
  }

  /**
   * Upsert by email within a branch.
   * - Normalizes email/phone
   * - Useful for imports or quick create-or-update flows
   */
  async upsertByEmailInBranch(
    branchId: Types.ObjectId | string,
    email: string,
    update: AnyKeys<ICustomer>,
    opts?: WriteOptions
  ): Promise<CustomerDoc> {
    const filter = { branch_id: branchId, email: normEmail(email) };
    const toSet: AnyKeys<ICustomer> = { ...update } as any;
    if ((toSet as any).phone) (toSet as any).phone = normPhone((toSet as any).phone);
    return this.upsert(filter, toSet, opts);
  }
}

// Optional singleton
export const customerRepository = new CustomerRepository();
