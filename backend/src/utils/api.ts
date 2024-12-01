// src/utils/api.ts
import axios from 'axios';
import cheerio from 'cheerio';
import { cleanHtml } from './helpers';
import Article from '../models/Article';

const client_id = "pk58dq7tnbpRqjUTnE51";
const client_secret = "deoKEIaIyh";

// 네이버 Open API URL 정보
const base_url = "https://openapi.naver.com/v1/search";
const node = "/news.json";

export const getNewsSearchResult = async (src_text: string, start: number = 1, display: number = 10, sort: string = "date") => {
  const api_url = `${base_url}${node}?query=${encodeURIComponent(src_text)}&start=${start}&display=${display}&sort=${sort}`;
  try {
    const response = await axios.get(api_url, {
      headers: {
        'X-Naver-Client-Id': client_id,
        'X-Naver-Client-Secret': client_secret
      }
    });
    if (response.status === 200) {
      const newsItems = response.data.items;
      const filteredNews = removeDuplicates(newsItems);

      const detailedNews = filteredNews.map((item: any) => ({
        title: cleanHtml(item.title),
        originallink: item.originallink || 'No original link found',
        link: item.link || 'No link found',
        description: cleanHtml(item.description) || 'No description found',
        pubDate: item.pubDate || 'No publication date found'
      }));

      return detailedNews;
    }
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return null;
  }
  return null;
};

const removeDuplicates = (news_items: any[]) => {
  const seenTitles = new Set();
  const uniqueNews = news_items.filter(item => {
    const title = item.title;
    if (!seenTitles.has(title)) {
      seenTitles.add(title);
      return true;
    }
    return false;
  });
  return uniqueNews;
};

export const fetchHeadlines = async (
  url: string,
  itemSelector: string,
  titleSelector: string,
  linkSelector: string,
  imageSelector: string,
  summarySelector: string
) => {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  try {
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const newsItems = $(itemSelector);
      const headlines: any[] = [];

      newsItems.each((index, element) => {
        const titleTag = $(element).find(titleSelector);
        const linkTag = $(element).find(linkSelector);
        const imageTag = $(element).find(imageSelector);
        const summaryTag = $(element).find(summarySelector);

        const title = cleanHtml(titleTag.text()) || "No title found";
        const link = linkTag.attr('href') || "No link found";
        const image_url = getImageUrl(imageTag) || "No image found";
        const summary = cleanHtml(summaryTag.text().trim()) || "No summary available";

        headlines.push({ title, link, image_url, summary });
      });

      return headlines;
    } else {
      console.error("뉴스 페이지 요청 실패, 상태 코드:", response.status);
    }
  } catch (error) {
    console.error("뉴스 페이지 요청 중 오류 발생:", error);
  }
  return [];
};

const getImageUrl = (imageTag: cheerio.Cheerio<any>) => {
  if (!imageTag) {
    return "No image found";
  }

  if (imageTag.attr('src')) {
    return imageTag.attr('src')!;
  }

  const dataSrc = imageTag.attr('data-src') || imageTag.attr('data-lazy-src');
  if (dataSrc) {
    return dataSrc;
  }

  return "No image found";
};

export const getBreakingHeadlines = async () => {
  const url = "https://news.naver.com/main/list.naver?mode=LSD&mid=sec&sid1=001";
  const itemSelector = '.type06_headline li, .type06 li';
  const titleSelector = 'dt:not(.photo) a';
  const linkSelector = 'dt:not(.photo) a';
  const imageSelector = 'dt.photo img';
  const summarySelector = '.lede';

  try {
    const headlines = await fetchHeadlines(url, itemSelector, titleSelector, linkSelector, imageSelector, summarySelector);
    return headlines;
  } catch (error) {
    console.error("Breaking headlines 가져오기 실패:", error);
    return [];
  }
};

export const getTrendingKeywords = async () => {
  const keywordUrl = "https://coinpan.com/free";
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  try {
    const response = await axios.get(keywordUrl, { headers });
    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const keywordElements = $('.realtimeranking_widget_content.popular ul li a');

      if (keywordElements.length === 0) {
        console.error("페이지에서 키워드를 찾을 수 없습니다.");
        return { keywords: ["테스트 키워드1", "테스트 키워드2"], popularity: [10, 9] };
      }

      const keywords: string[] = [];
      const popularity: number[] = [];

      keywordElements.each((index, element) => {
        const rank = $(element).find('span').text().trim();
        const keywordText = $(element).text().replace(rank, '').trim();
        keywords.push(keywordText);
        popularity.push(11 - (index + 1));
      });

      return { keywords, popularity };
    }
  } catch (error) {
    console.error("키워드 로드 실패:", error);
    return { keywords: ["테스트 키워드1", "테스트 키워드2"], popularity: [10, 9] };
  }
};
