import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICounter extends Document {
  _id: string; // e.g., "USER:H2GO"
  seq: number;
}

const counterSchema = new Schema<ICounter>(
  {
    _id: { type: String, required: true, trim: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
);

counterSchema.index({ _id: 1 }, { unique: true });

const Counter: Model<ICounter> = mongoose.model<ICounter>("Counter", counterSchema);
export default Counter;
