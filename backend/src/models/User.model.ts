import mongoose, { Schema, Document, Types, Model } from 'mongoose';

export interface IUser extends Document {
  name: String;
  surname: String;
  id_number: String;
  email_address: String;
  mobile_number: String;
  gender: String;
  password: String;
  user_type: String;
  company_id: Types.ObjectId;
  confirmed: boolean;
  active: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    id_number: { type: String, required: true, unique: true },
    email_address: { type: String, required: true, unique: true },
    mobile_number: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    user_type: { type: String, required: true },
    confirmed: { type: Boolean, required: true },
    active: { type: Boolean, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
