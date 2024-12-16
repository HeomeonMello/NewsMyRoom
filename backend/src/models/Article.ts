// src/models/Article.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
    title: string;
    link: string;
    section: string;
    publishedAt: Date;
    // 필요한 다른 필드들을 추가하세요.
}

const ArticleSchema: Schema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    section: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    // 필요한 다른 필드들을 스키마에 추가하세요.
});

export default mongoose.model<IArticle>('Article', ArticleSchema);
