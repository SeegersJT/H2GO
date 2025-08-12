import mongoose, { Model, Schema } from "mongoose";
import { ICounter } from "../types/core";

const CounterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const Counter: Model<ICounter> = mongoose.model<ICounter>("Counter", CounterSchema);
export default Counter;
