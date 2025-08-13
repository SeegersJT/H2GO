import mongoose, { Schema, Document, Types, Model } from "mongoose";
import Branch from "./Branch.model";
import { nextSeq, formatHumanCode } from "../utils/sequence.utils";

export interface IPriceListItem {
  product_id: Types.ObjectId; // -> Product
  unit_price: number; // price per sellable unit
  min_qty?: number; // for simple tiering (default 1)
  currency_code?: string; // override list currency if needed
}

export interface IPriceList extends Document {
  price_list_no: string; // e.g., "PL-H2GO-0001"
  branch_id: Types.ObjectId; // -> Branch (scope for numbering)
  name: string; // "Retail ZA", "Acme Contract"
  currency_code: string; // ISO-4217 (e.g., "ZAR")
  valid_from?: Date;
  valid_to?: Date;
  active: boolean;
  is_default?: boolean; // branch default
  customer_id?: Types.ObjectId | null; // optional customer-specific list
  items: IPriceListItem[]; // product price rows
  priority?: number; // resolve conflicts (higher wins)

  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const priceListItemSchema = new Schema<IPriceListItem>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    unit_price: { type: Number, required: true, min: 0 },
    min_qty: { type: Number, min: 1, default: 1 },
    currency_code: { type: String, trim: true, set: (v: string) => v?.toUpperCase() },
  },
  { _id: false }
);

const priceListSchema = new Schema<IPriceList>(
  {
    price_list_no: { type: String, required: true, unique: true, trim: true },
    branch_id: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    name: { type: String, required: true, trim: true },
    currency_code: { type: String, required: true, trim: true, set: (v: string) => v?.toUpperCase() },
    valid_from: { type: Date },
    valid_to: { type: Date },
    active: { type: Boolean, required: true, default: true, index: true },
    is_default: { type: Boolean, default: false, index: true },
    customer_id: { type: Schema.Types.ObjectId, ref: "Customer", default: null, index: true },
    items: { type: [priceListItemSchema], default: [], validate: [(v: IPriceListItem[]) => v?.length > 0, "at least one item required"] },
    priority: { type: Number, default: 0, index: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

priceListSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && !this.price_list_no) {
      const branch = await Branch.findById(this.branch_id).select("branch_abbreviation").lean();
      if (!branch?.branch_abbreviation) return next(new Error("Invalid branch_id for price_list_no"));
      const scope = String(branch.branch_abbreviation).toUpperCase();
      const seq = await nextSeq("PL", scope);
      this.price_list_no = formatHumanCode("PL", scope, seq, 4);
    }
    next();
  } catch (e) {
    next(e as any);
  }
});

priceListSchema.index({ branch_id: 1, name: 1 }, { collation: { locale: "en", strength: 2 }, name: "search_pricelist_name" });
priceListSchema.set("toJSON", { versionKey: false, transform: (_d, r) => r });

const PriceList: Model<IPriceList> = mongoose.model<IPriceList>("PriceList", priceListSchema);
export default PriceList;
