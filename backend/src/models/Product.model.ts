import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  amount: number;
  measurement: string;
  price: number;
  uses: number;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    measurement: { type: String, required: true },
    price: { type: Number, required: true },
    uses: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);
export default Product;
