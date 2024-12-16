// src/routes/apiRoutes.ts
import express from 'express';
import {
    scrapeAndStore,
    fetchBreakingHeadlines,
    fetchTrendingKeywords,
} from '../controllers/apiController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/scrape', authMiddleware, scrapeAndStore);
router.get('/breaking-headlines', fetchBreakingHeadlines);
router.get('/trending-keywords', fetchTrendingKeywords);

export default router;
