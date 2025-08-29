import mongoose, { Schema, Document, Types, Model } from "mongoose";
import { CommunicationStatus } from "../utils/constants/Communication.constant";

export interface ICommunicationRequest extends Document {
  user_id: Types.ObjectId;
  template_id: Types.ObjectId;
  status: CommunicationStatus;
  handled: boolean;
  handle_result?: string;
  sent_at?: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const communicationRequestSchema = new Schema<ICommunicationRequest>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    template_id: { type: Schema.Types.ObjectId, ref: "CommunicationTemplate", required: true },
    status: {
      type: String,
      enum: Object.values(CommunicationStatus),
      required: true,
      default: CommunicationStatus.REQUESTED,
    },
    handled: { type: Boolean, required: true, default: false },
    handle_result: { type: String },
    sent_at: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
  },
  { timestamps: true }
);

communicationRequestSchema.set("toJSON", {
  versionKey: false,
});

const CommunicationRequest: Model<ICommunicationRequest> = mongoose.model<ICommunicationRequest>("CommunicationRequest", communicationRequestSchema);
export default CommunicationRequest;
