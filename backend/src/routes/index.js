const express = require('express');
const router = express.Router();

// 기본 라우트
router.get('/', (req, res) => {
    res.send('Welcome to NewsMyRoom Backend API');
});

module.exports = router;
