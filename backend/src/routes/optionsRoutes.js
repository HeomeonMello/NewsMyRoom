const express = require('express');
const router = express.Router();

// 예시 데이터 - 실제로는 데이터베이스나 외부 API에서 가져와야 합니다
const imageTags = require('../data/LOOKUP-IMAGETAGS.json');
const gkgThemes = require('../data/LOOKUP-GKGTHEMES.json');
// ... 다른 필요한 데이터도 유사하게 로드

// 각 엔드포인트 정의
router.get('/imagetags', (req, res) => {
    res.json(imageTags);
});

router.get('/gkgthemes', (req, res) => {
    res.json(gkgThemes);
});

// TV 스테이션 디테일 엔드포인트
router.get('/tv/stationdetails', async (req, res) => {
    try {
        const axios = require('axios'); // axios가 설치되어 있어야 합니다
        const response = await axios.get('https://api.gdeltproject.org/api/v2/tv/tv', {
            params: {
                mode: 'stationdetails',
                format: 'json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching TV station details:', error);
        res.status(500).json({ error: 'Failed to fetch TV station details' });
    }
});

// 다른 옵션 엔드포인트도 유사하게 추가
// 예시:
router.get('/languages', (req, res) => {
    // languages 데이터를 반환
});

router.get('/countries', (req, res) => {
    // countries 데이터를 반환
});

// ... 필요한 모든 옵션 엔드포인트 추가

module.exports = router;
