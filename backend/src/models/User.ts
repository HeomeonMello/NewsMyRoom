// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  userid: string;
  interests: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userid: { type: String, required: true, unique: true },
    interests: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
