// src/server.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { connectDB } from './utils/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import newsRoutes from './routes/newsRoutes';
import apiRoutes from './routes/apiRoutes';
import recommendationRoutes from './routes/recommendationRoutes';

dotenv.config();

const app: Application = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(helmet());

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);
app.use('/api', apiRoutes);
app.use('/api/recommendations', recommendationRoutes);

// 기본 라우트
app.get('/', (req: Request, res: Response) => {
  res.send('뉴스마이룸 백엔드 서버입니다.');
});

// Ping 라우트
app.get('/ping', async (req: Request, res: Response) => {
  try {
    await connectDB();
    res.status(200).json({ message: 'pong', db_status: 'connected' });
  } catch {
    res.status(500).json({ message: 'pong', db_status: 'disconnected' });
  }
});

// 에러 핸들러 미들웨어
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '서버 오류', error: err.message });
});

// MongoDB 연결 및 서버 시작
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  });
});

export default app;
