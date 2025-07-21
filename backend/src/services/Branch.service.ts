import { FilterQuery } from "mongoose";
import Branch, { IBranch } from "../models/Branch.model";
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
  const branch = new Branch(branchData);
  return await branch.save();
};
