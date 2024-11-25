// src/models/Article.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  link: string;
  image_url: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    image_url: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IArticle>('Article', ArticleSchema);
