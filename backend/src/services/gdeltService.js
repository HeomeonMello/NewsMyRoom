// backend/src/services/gdeltService.js
const axios = require('axios');

const GDELT_API_BASE_URL = 'https://api.gdeltproject.org/api/v2/';

exports.callGdeltAPI = async (queryParams) => {
    try {
        const { api, ...params } = queryParams;

        // 'api' 파라미터 유효성 검사
        if (!['doc', 'geo', 'tv'].includes(api)) {
            throw new Error('Invalid API type. Must be doc, geo, or tv.');
        }

        // 모드 설정
        let mode;
        switch(api) {
            case 'doc':
                mode = params.timelinemode || 'content';
                break;
            case 'geo':
                mode = 'geo';
                break;
            case 'tv':
                mode = 'tv';
                break;
            default:
                mode = 'content';
        }

        // 쿼리 문자열 구성
        const queryString = new URLSearchParams({
            mode: mode,
            query: params.query || '',
            ...params
        }).toString();

        // 최종 API URL 구성
        const apiUrl = `${GDELT_API_BASE_URL}${api}/${api}?${queryString}`;

        // GDELT API 호출
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error calling GDELT API:', error.message);
        throw error;
    }
};

// 데이터 분석 로직 구현 (필요 시 확장)
exports.analyzeData = async (analysisParams) => {
    // 분석 로직 구현
    return { message: '분석이 성공적으로 완료되었습니다.' };
};
