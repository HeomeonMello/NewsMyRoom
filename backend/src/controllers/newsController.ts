// src/controllers/newsController.ts
import { Request, Response } from 'express';
import { recommendArticles } from '../utils/recommend';
import { scrapeAndStoreArticles } from '../utils/scraper';

interface AuthRequest extends Request {
  user?: any;
}

export const scrapeAndStore = async (req: Request, res: Response) => {
  try {
    await scrapeAndStoreArticles();
    res.status(200).json({ message: '뉴스 기사 스크래핑 및 저장 성공' });
  } catch (error) {
    res.status(500).json({ message: '뉴스 기사 스크래핑 실패', error });
  }
};

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  try {
    const recommendedArticles = await recommendArticles(req.user.userid, req.headers.host as string);

    if (recommendedArticles) {
      return res.status(200).json(recommendedArticles);
    } else {
      return res.status(500).json({ message: '추천 기사를 가져오는 데 실패했습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '추천 기사 생성 실패', error });
  }
};
