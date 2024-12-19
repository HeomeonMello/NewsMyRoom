// src/controllers/searchController.js
const axios = require('axios');

/**
 * GDELT API 프록시 컨트롤러
 * 클라이언트로부터 받은 요청을 GDELT API로 전달하고 응답을 반환합니다.
 */
const searchGdelt = async (req, res) => {
    try {
        const { api, ...queryParams } = req.query;

        // 유효한 API 타입 확인
        if (!['doc', 'geo', 'tv'].includes(api)) {
            return res.status(400).json({ message: '유효하지 않은 API 타입입니다. (doc, geo, tv 중 하나를 선택하세요)' });
        }

        // GDELT API 엔드포인트 설정
        const gdeltApiUrl = `https://api.gdeltproject.org/api/v2/${api}/${api}`;

        // GDELT API 호출
        const response = await axios.get(gdeltApiUrl, { params: queryParams });

        // 결과 반환
        res.json(response.data);
    } catch (error) {
        console.error('GDELT API 호출 오류:', error.message);

        // GDELT API 오류 응답 처리
        if (error.response) {
            // GDELT API에서 오류 응답을 받은 경우
            res.status(error.response.status).json({ message: error.response.data.message || 'GDELT API 호출에 실패했습니다.' });
        } else {
            // 네트워크 오류 또는 기타 오류
            res.status(500).json({ message: 'GDELT API 호출 중 서버 오류가 발생했습니다.' });
        }
    }
};

module.exports = { searchGdelt };
