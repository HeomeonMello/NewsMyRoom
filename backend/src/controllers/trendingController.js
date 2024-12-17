// backend/src/controllers/trendingController.js

const axios = require('axios');
const cheerio = require('cheerio');

// 텍스트 정리 함수
function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

// 중복 기사 제거 함수
function removeDuplicates(newsItems) {
    const seen = new Set();
    return newsItems.filter(item => {
        if (seen.has(item.title)) return false;
        seen.add(item.title);
        return true;
    });
}

// 이미지 URL 추출 함수
function getImageUrl($, imageTag) {
    if (!imageTag || !imageTag.length) {
        return "No image found";
    }

    const src = imageTag.attr('src');
    if (src) return src;

    const dataSrc = imageTag.attr('data-src');
    if (dataSrc) return dataSrc;

    const dataLazySrc = imageTag.attr('data-lazy-src');
    if (dataLazySrc) return dataLazySrc;

    return "No image found";
}

// 공통 스크래핑 함수
async function fetchHeadlines(url, itemSelector, titleSelector, linkSelector, imageSelector, summarySelector, limit=5) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
                    '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const newsItems = $(itemSelector).slice(0, limit);

        const headlines = [];
        newsItems.each((_, item) => {
            const el = $(item);
            const titleTag = el.find(titleSelector).first();
            const linkTag = el.find(linkSelector).first();
            const imageTag = el.find(imageSelector).first();
            const summaryTag = el.find(summarySelector).first();

            const title = titleTag && titleTag.text().trim() ? cleanText(titleTag.text()) : "No title found";
            const link = linkTag && linkTag.attr('href') ? linkTag.attr('href') : "No link found";
            const image_url = getImageUrl($, imageTag);
            const summary = summaryTag && summaryTag.text().trim() ? cleanText(summaryTag.text()) : "No summary available";

            headlines.push({ title, link, image_url, summary });
        });

        return removeDuplicates(headlines);
    } catch (error) {
        console.error(`Error fetching headlines from ${url}:`, error.message);
        return [];
    }
}

/** 섹션별 함수들 **/

function getPoliticsHeadlines() {
    const url = "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=100";
    return fetchHeadlines(
        url,
        'li.sa_item._SECTION_HEADLINE',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getEconomyHeadlines() {
    const url = "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=101";
    return fetchHeadlines(
        url,
        'li.sa_item._SECTION_HEADLINE',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getSocietyHeadlines() {
    const url = "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=102";
    return fetchHeadlines(
        url,
        'li.sa_item._SECTION_HEADLINE',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getLifeHeadlines() {
    const url = "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=103";
    return fetchHeadlines(
        url,
        'li.sa_item._SECTION_HEADLINE',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getCarHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/239";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getITHeadlines() {
    const url = "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=105";
    return fetchHeadlines(
        url,
        'li.sa_item._SECTION_HEADLINE',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getWorldHeadlines() {
    const url = "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=104";
    return fetchHeadlines(
        url,
        'li.sa_item._SECTION_HEADLINE',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getHealthHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/241";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getTravelHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/237";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getFoodHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/238";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getEntertainmentHeadlines() {
    const url = "https://entertain.naver.com/now";
    return fetchHeadlines(
        url,
        '.news_lst.news_lst2 li',
        '.tit a',
        '.tit a',
        'img',
        'p.summary'
    );
}

function getFashionHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/376";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getExhibitionHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/242";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getBookHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/243";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getReligionHeadlines() {
    const url = "https://news.naver.com/breakingnews/section/103/244";
    return fetchHeadlines(
        url,
        'li.sa_item._LAZY_LOADING_WRAP',
        '.sa_text_title .sa_text_strong',
        '.sa_text_title a',
        '.sa_thumb_link img',
        '.sa_text_lede'
    );
}

function getBreakingHeadlines() {
    const url = "https://news.naver.com/main/list.naver?mode=LSD&mid=sec&sid1=001";
    return fetchHeadlines(
        url,
        '.type06_headline li, .type06 li',
        'dt:not(.photo) a',
        'dt:not(.photo) a',
        'dt.photo img',
        '.lede',
        5
    );
}

// 트렌딩 뉴스 컨트롤러
exports.getTrendingNews = async (req, res) => {
    try {
        const [
            politics,
            economy,
            society,
            life,
            car,
            it,
            world,
            health,
            travel,
            food,
            entertainment,
            fashion,
            exhibition,
            book,
            religion,
            breaking
        ] = await Promise.all([
            getPoliticsHeadlines(),
            getEconomyHeadlines(),
            getSocietyHeadlines(),
            getLifeHeadlines(),
            getCarHeadlines(),
            getITHeadlines(),
            getWorldHeadlines(),
            getHealthHeadlines(),
            getTravelHeadlines(),
            getFoodHeadlines(),
            getEntertainmentHeadlines(),
            getFashionHeadlines(),
            getExhibitionHeadlines(),
            getBookHeadlines(),
            getReligionHeadlines(),
            getBreakingHeadlines()
        ]);

        res.json({
            politics,
            economy,
            society,
            life,
            car,
            it,
            world,
            health,
            travel,
            food,
            entertainment,
            fashion,
            exhibition,
            book,
            religion,
            breaking
        });
    } catch (error) {
        console.error("Error in getTrendingNews:", error);
        res.status(500).json({ error: "Failed to fetch trending news" });
    }
};
