// backend/src/controllers/gdeltController.js
const gdeltService = require('../services/gdeltService');

// GDELT API 호출 핸들러
exports.fetchData = async (req, res, next) => {
    try {
        const queryParams = req.query; // 프론트엔드로부터 받은 쿼리 파라미터
        const apiResponse = await gdeltService.callGdeltAPI(queryParams);
        res.json(apiResponse);
    } catch (error) {
        next(error);
    }
};

// 데이터 분석 핸들러 (필요 시 구현)
exports.analyzeData = async (req, res, next) => {
    try {
        const analysisParams = req.body; // 프론트엔드로부터 받은 분석 파라미터
        const analysisResult = await gdeltService.analyzeData(analysisParams);
        res.json(analysisResult);
    } catch (error) {
        next(error);
    }
};
