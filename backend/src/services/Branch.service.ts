import { Types } from "mongoose";
import { branchRepository } from "../repositories/Branch.repository";
import type { IBranch } from "../models/Branch.model";

export class BranchService {
  static async getAllBranches() {
    return branchRepository.findMany({});
  }

  static async getBranchById(id: string) {
    return branchRepository.findById(new Types.ObjectId(id));
  }

  static async getBranchByFields(filter: any) {
    return branchRepository.findOne(filter);
  }

  static async insertBranch(data: Partial<IBranch>) {
    return branchRepository.create(data);
  }

  static async updateBranch(id: string, data: Partial<IBranch>) {
    return branchRepository.updateById(new Types.ObjectId(id), data);
  }

  static async softDeleteBranch(id: string, actorId: string) {
    return branchRepository.updateById(new Types.ObjectId(id), { active: false }, { actorId: new Types.ObjectId(actorId) });
  }
}
