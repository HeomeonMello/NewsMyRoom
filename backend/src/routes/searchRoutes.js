const express = require('express');
const router = express.Router();
const axios = require('axios');

// Search 엔드포인트
router.get('/search', async (req, res) => {
    try {
        const { query, trans, domainis, api, ...otherParams } = req.query;

        // GDELT API 호출을 위한 파라미터 구성
        let gdeltParams = {
            query: query,
            ...otherParams,
            format: 'json'
        };

        if (trans) gdeltParams.trans = 'googtrans';
        if (domainis) gdeltParams.domainis = domainis;

        // GDELT API URL 구성
        const gdeltURL = `https://api.gdeltproject.org/api/v2/${api}/${api}`;

        // GDELT API 호출
        const gdeltResponse = await axios.get(gdeltURL, { params: gdeltParams });

        res.json(gdeltResponse.data);
    } catch (error) {
        console.error('Error fetching data from GDELT API:', error);
        res.status(500).json({ error: 'Failed to fetch data from GDELT API' });
    }
});

module.exports = router;
