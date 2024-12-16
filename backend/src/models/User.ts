// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// 사용자 인터페이스 정의
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    userid: string;
    interests: string[];
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userid: { type: String, required: true, unique: true },
    interests: { type: [String], default: [] }
});

export default mongoose.model<IUser>('User', UserSchema);
