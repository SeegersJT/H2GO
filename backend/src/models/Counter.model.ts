import mongoose, { Schema, Document, Model } from "mongoose";

interface ICounter extends Document {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter: Model<ICounter> = mongoose.model<ICounter>("Counter", counterSchema);
export default Counter;
