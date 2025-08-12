import { Types } from "mongoose";

export type ObjectId = Types.ObjectId;

export interface AuditTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICounter {
  _id: string;
  seq: number;
}

export type YesNo = "YES" | "NO";
