// backend/src/routes/trendingRoutes.js

const express = require('express');
const router = express.Router();
const { getTrendingNews } = require('../controllers/trendingController');

// 트렌딩 뉴스 가져오기
router.get('/', getTrendingNews);

module.exports = router;
