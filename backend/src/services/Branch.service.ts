import { FilterQuery } from "mongoose";
import { IBranch } from "../models/Branch.model";
import * as branchRepository from "../repositories/Branch.repository";

export const getAllBranches = async () => {
  return await branchRepository.findAllBranches();
};

export const getBranchById = async (id: string) => {
  return await branchRepository.findBranchById(id);
};

export const getBranchByFields = async (params: FilterQuery<IBranch>) => {
  return await branchRepository.findBranchByFields(params);
};

export const insertBranch = async (branchData: Partial<IBranch>): Promise<IBranch> => {
  return await branchRepository.insertBranch(branchData);
};

export const updateBranch = async (
  id: string,
  updateData: Partial<IBranch>
): Promise<IBranch | null> => {
  return branchRepository.updateBranchById(id, updateData);
};

export const softDeleteBranch = async (id: string) => {
  return await branchRepository.softDeleteBranchById(id);
};
