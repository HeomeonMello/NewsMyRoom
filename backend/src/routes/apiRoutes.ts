// src/routes/apiRoutes.ts
import express from 'express';
import { scrapeAndStore, fetchBreakingHeadlines, fetchTrendingKeywords } from '../controllers/apiController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// 뉴스 스크래핑 및 저장 라우트
router.post('/scrape_and_store', scrapeAndStore);

// Breaking headlines 가져오기 라우트
router.get('/breaking_headlines', fetchBreakingHeadlines);

// Trending keywords 가져오기 라우트
router.get('/trending_keywords', fetchTrendingKeywords);

export default router;
