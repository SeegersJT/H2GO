import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { CommunicationMethod, CommunicationType } from "../utils/constants/Communication.constant";

export interface ICommunicationTemplate extends Document {
  method: CommunicationMethod;
  type: CommunicationType;
  subject?: string;
  body: string;
  parent_template: Types.ObjectId | null;
  active: boolean;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const communicationTemplateSchema = new Schema<ICommunicationTemplate>(
  {
    method: { type: String, required: true, enum: Object.values(CommunicationMethod) },
    type: { type: String, required: true, enum: Object.values(CommunicationType) },
    subject: { type: String },
    body: { type: String, required: true },
    parent_template: { type: Schema.Types.ObjectId, ref: "CommunicationTemplate", required: false, default: null },
    active: { type: Boolean, required: true, default: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

communicationTemplateSchema.set("toJSON", {
  versionKey: false,
});

const CommunicationTemplate: Model<ICommunicationTemplate> = mongoose.model<ICommunicationTemplate>(
  "CommunicationTemplate",
  communicationTemplateSchema
);
export default CommunicationTemplate;
