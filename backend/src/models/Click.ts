// src/models/Click.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IClick extends Document {
  user_id: string;
  news_title: string;
  news_description: string;
  news_url: string;
  publish_time: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClickSchema: Schema = new Schema<IClick>(
  {
    user_id: { type: String, required: true },
    news_title: { type: String, required: true },
    news_description: { type: String, required: true },
    news_url: { type: String, required: true },
    publish_time: { type: Date, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IClick>('Click', ClickSchema);
