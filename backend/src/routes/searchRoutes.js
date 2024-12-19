// src/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const { searchGdelt } = require('../controllers/searchController');
const { protect } = require('../middlewares/authMiddleware');

// GDELT 검색 API (보호된 라우트)
router.get('/', protect, searchGdelt);

module.exports = router;
