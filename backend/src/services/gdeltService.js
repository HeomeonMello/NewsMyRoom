const axios = require('axios');
const config = require('config');

const GDELT_API_URL = config.get('GDELT_API_URL');

// GDELT API 연동 로직
exports.fetchGdeltData = async (params) => {
    try {
        const response = await axios.get(GDELT_API_URL, { params });
        return response.data;
    } catch (error) {
        throw new Error('Error fetching data from GDELT API');
    }
};

// 추가 GDELT 관련 서비스 메소드
