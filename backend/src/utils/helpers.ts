// src/utils/helpers.ts
import { unescape } from 'html-entities';
import cheerio from 'cheerio';

export const cleanHtml = (rawHtml: string): string => {
  if (!rawHtml || rawHtml.indexOf('<') === -1) {
    return unescape(rawHtml);
  }

  try {
    const $ = cheerio.load(rawHtml);
    const text = $.text();
    return unescape(text);
  } catch (error) {
    console.error("HTML 클리닝 중 오류 발생:", error);
    return unescape(rawHtml);
  }
};
