// backend/src/routes/newsRoutes.js

const express = require('express');
const News = require('../models/News');
const auth = require('../middleware/auth');

const router = new express.Router();

// 기사 저장 API 엔드포인트
router.post('/saveArticle', auth, async (req, res) => {
    try {
        const { title, description, url, source, date, language, location } = req.body;

        // 필수 필드 검증
        if (!title || !description || !url || !source || !date || !language || !location) {
            return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
        }

        const newArticle = new News({
            title,
            description,
            url,
            source,
            date: new Date(date),
            language,
            location,
            user: req.user._id
        });

        await newArticle.save();
        res.status(200).json({ message: '기사가 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('기사 저장 중 오류 발생:', error);
        if (error.code === 11000) { // 중복 키 에러
            res.status(400).json({ message: '이미 저장된 기사입니다.' });
        } else {
            res.status(500).json({ message: '기사 저장에 실패했습니다.' });
        }
    }
});

module.exports = router;
