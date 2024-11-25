// src/utils/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/newsmyroom';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB에 성공적으로 연결되었습니다.');
  } catch (error) {
    console.error('MongoDB 연결 오류:', error);
    process.exit(1); // 연결 실패 시 애플리케이션 종료
  }
};
