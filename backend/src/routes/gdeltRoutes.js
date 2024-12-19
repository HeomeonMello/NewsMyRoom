// backend/src/routes/gdeltRoutes.js
const express = require('express');
const router = express.Router();
const gdeltController = require('../controllers/gdeltController');

// GDELT 데이터 가져오기 엔드포인트
router.get('/fetch-data', gdeltController.fetchData);

// GDELT 데이터 분석 엔드포인트 (추가 가능)
router.post('/analyze', gdeltController.analyzeData);

module.exports = router;
