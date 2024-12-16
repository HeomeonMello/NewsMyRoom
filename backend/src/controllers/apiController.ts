// src/controllers/apiController.ts
import { Request, Response } from 'express';
import {
  getNewsSearchResult,
  getBreakingHeadlines,
  getTrendingKeywords,
} from '../utils/api';
import Article, { IArticle } from '../models/Article'; // Article 모델 임포트

// Headline 인터페이스 정의
interface Headline {
  title: string;
  link: string;
  section: string;
  publishedAt?: Date;
}

export const scrapeAndStore = async (req: Request, res: Response): Promise<void> => {
  try {
    const sections: string[] = [
      'politics',
      'economy',
      'society',
      'life',
      'car',
      'it',
      'world',
      'health',
      'travel',
      'food',
      'fashion',
      'exhibition',
      'book',
      'religion',
      'entertainment',
    ];

    for (const section of sections) {
      const headlines: Headline[] | null = await getNewsSearchResult(section);
      if (headlines) {
        for (const headline of headlines) {
          try {
            await insertArticle(headline);
          } catch (error) {
            console.error(`기사 삽입 오류 (${headline.title}):`, error);
          }
        }
      }
    }

    res.status(200).json({ message: '뉴스 기사 스크래핑 및 저장 성공' });
  } catch (error) {
    console.error('뉴스 스크래핑 실패:', error);
    res.status(500).json({ message: '뉴스 기사 스크래핑 실패', error });
  }
};

const insertArticle = async (headline: Headline): Promise<void> => {
  try {
    const existing: IArticle | null = await Article.findOne({ link: headline.link });
    if (!existing) {
      const newArticle: IArticle = new Article(headline);
      await newArticle.save();
    }
  } catch (error) {
    console.error('기사 삽입 오류:', error);
    throw error; // 에러를 다시 던져 상위에서 인지할 수 있도록 함
  }
};

export const fetchBreakingHeadlines = async (req: Request, res: Response): Promise<void> => {
  try {
    const headlines: Headline[] = await getBreakingHeadlines();
    res.status(200).json(headlines);
  } catch (error) {
    console.error('Breaking headlines 가져오기 실패:', error);
    res.status(500).json({ message: 'Breaking headlines 가져오기 실패', error });
  }
};

export const fetchTrendingKeywords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keywords, popularity } = await getTrendingKeywords();
    res.status(200).json({ keywords, popularity });
  } catch (error) {
    console.error('Trending keywords 가져오기 실패:', error);
    res.status(500).json({ message: 'Trending keywords 가져오기 실패', error });
  }
};
