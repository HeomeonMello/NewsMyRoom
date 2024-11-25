// src/utils/scraper.ts
// 실제 스크래핑 로직은 사용 중인 API 또는 웹사이트에 따라 달라집니다.
// 여기서는 간단한 예시를 제공합니다.

import axios from 'axios';
import cheerio from 'cheerio';
import mongoose from 'mongoose';

interface Headline {
  title: string;
  link: string;
  image_url: string;
  summary: string;
}

export const scrapeAndStoreArticles = async (): Promise<void> => {
  try {
    const sections = [
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
      'entertainment'
    ];

    for (const section of sections) {
      const headlines = await getHeadlines(section);
      for (const headline of headlines) {
        await insertArticle(headline.title, headline.link, headline.image_url, headline.summary);
      }
    }

    console.log('모든 뉴스 기사가 성공적으로 스크래핑되고 저장되었습니다.');
  } catch (error) {
    console.error('뉴스 스크래핑 오류:', error);
  }
};

// 예시: 특정 섹션에서 헤드라인을 가져오는 함수
const getHeadlines = async (section: string): Promise<Headline[]> => {
  const url = `https://example.com/news/${section}`;
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  const headlines: Headline[] = [];

  // 실제 웹사이트의 구조에 맞게 선택자를 조정해야 합니다.
  $('.headline').each((index, element) => {
    const title = $(element).find('.title').text().trim();
    const link = $(element).find('a').attr('href') || '';
    const image_url = $(element).find('img').attr('src') || '';
    const summary = $(element).find('.summary').text().trim();

    headlines.push({ title, link, image_url, summary });
  });

  return headlines;
};

// MongoDB에 기사 삽입 함수
const insertArticle = async (title: string, link: string, image_url: string, summary: string) => {
  const ArticleSchema = new mongoose.Schema({
    title: String,
    link: String,
    image_url: String,
    summary: String
  });

  const Article = mongoose.model('Article', ArticleSchema);

  // 중복 기사 확인 후 삽입
  const existing = await Article.findOne({ link });
  if (!existing) {
    const newArticle = new Article({ title, link, image_url, summary });
    await newArticle.save();
  }
};
