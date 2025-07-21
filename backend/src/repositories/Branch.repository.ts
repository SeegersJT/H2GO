import { FilterQuery } from "mongoose";
import Branch, { IBranch } from "../models/Branch.model";

export const findAllBranches = async (): Promise<IBranch[]> => {
  return await Branch.find({}, { password: 0 });
};

export const findBranchById = async (id: string): Promise<IBranch | null> => {
  return await Branch.findById(id, { password: 0 });
};

export const findBranchByFields = async (params: FilterQuery<IBranch>): Promise<IBranch | null> => {
  return await Branch.findOne(params);
};

export const insertBranch = async (branchData: Partial<IBranch>): Promise<IBranch> => {
  const branch = new Branch(branchData);
  return await branch.save();
};
