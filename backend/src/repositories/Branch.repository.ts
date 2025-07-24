import { FilterQuery } from "mongoose";
import Branch, { IBranch } from "../models/Branch.model";

export class BranchRepositry {
  static findAllBranches = async (): Promise<IBranch[]> => {
    return await Branch.find({ active: true });
  };

  static findBranchById = async (id: string): Promise<IBranch | null> => {
    return await Branch.findById({ _id: id, active: true });
  };

  static findBranchByFields = async (params: FilterQuery<IBranch>): Promise<IBranch | null> => {
    return await Branch.findOne(params);
  };

  static insertBranch = async (branchData: Partial<IBranch>): Promise<IBranch> => {
    return await Branch.create(branchData);
  };

  static updateBranchById = async (id: string, updateData: Partial<IBranch>): Promise<IBranch | null> => {
    return Branch.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      upsert: false,
    });
  };

  static softDeleteBranchById = async (id: string, updatedBy: string) => {
    return Branch.findByIdAndUpdate(
      id,
      { active: false, updatedBy: updatedBy },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  };
}
