import BaseRepository from "./Base.repository";
import Branch from "../models/Branch.model";
import { IBranch } from "../types/location";

class BranchRepository extends BaseRepository<IBranch> {
  findByCode(code: string) {
    return this.findOne({ code: code.toUpperCase() } as any, { lean: true });
  }
}

export default new BranchRepository(Branch);
