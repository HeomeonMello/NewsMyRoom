// src/models/Click.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IClick extends Document {
    user_id: string;
    news_title: string;
    news_description?: string; // 선택적 필드
    news_url: string;
    publish_time: Date;
    readonly createdAt: Date; // 읽기 전용 필드
    readonly updatedAt: Date; // 읽기 전용 필드
}

const ClickSchema: Schema = new Schema<IClick>(
    {
        user_id: { type: String, required: true },
        news_title: { type: String, required: true },
        news_description: { type: String, required: false }, // 선택적 설정
        news_url: { type: String, required: true },
        publish_time: { type: Date, required: true }
    },
    { timestamps: true } // 자동으로 createdAt, updatedAt 추가
);

export default mongoose.model<IClick>('Click', ClickSchema);
