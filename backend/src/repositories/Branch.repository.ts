import { FilterQuery } from "mongoose";
import Branch, { IBranch } from "../models/Branch.model";

export const findAllBranches = async (): Promise<IBranch[]> => {
  return await Branch.find({ active: true });
};

export const findBranchById = async (id: string): Promise<IBranch | null> => {
  return await Branch.findById({ _id: id, active: true });
};

export const findBranchByFields = async (params: FilterQuery<IBranch>): Promise<IBranch | null> => {
  return await Branch.findOne(params);
};

export const insertBranch = async (branchData: Partial<IBranch>): Promise<IBranch> => {
  return await Branch.create(branchData);
};

export const updateBranchById = async (id: string, updateData: Partial<IBranch>): Promise<IBranch | null> => {
  return Branch.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
    upsert: false,
  });
};

export const softDeleteBranchById = async (id: string) => {
  return Branch.findByIdAndUpdate(
    id,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  ).exec();
};
