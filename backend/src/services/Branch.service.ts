import { FilterQuery } from "mongoose";
import { IBranch } from "../models/Branch.model";

import { BranchRepositry } from "../repositories/Branch.repository";
export class BranchService {
  static getAllBranches = async () => {
    return await BranchRepositry.findAllBranches();
  };

  static getBranchById = async (id: string) => {
    return await BranchRepositry.findBranchById(id);
  };

  static getBranchByFields = async (params: FilterQuery<IBranch>) => {
    return await BranchRepositry.findBranchByFields(params);
  };

  static insertBranch = async (branchData: Partial<IBranch>): Promise<IBranch> => {
    return await BranchRepositry.insertBranch(branchData);
  };

  static updateBranch = async (id: string, updateData: Partial<IBranch>): Promise<IBranch | null> => {
    return BranchRepositry.updateBranchById(id, updateData);
  };

  static softDeleteBranch = async (id: string, updatedBy: string) => {
    return await BranchRepositry.softDeleteBranchById(id, updatedBy);
  };
}
