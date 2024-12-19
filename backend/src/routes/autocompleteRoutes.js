const express = require('express');
const router = express.Router();
const axios = require('axios');
const makeSignature = require('../utils/ncpApiSignature');
require('dotenv').config();

const DOMAIN_NAME = process.env.DOMAIN_NAME || 'web'; // .env에서 설정

// GET /api/autocomplete?type=term&query=검색어
router.get('/', async (req, res) => {
    const { type, query } = req.query;

    console.log(`Autocomplete Request - Type: ${type}, Query: ${query}`);

    if (!type || !query) {
        return res.status(400).json({ message: 'type과 query는 필수 파라미터입니다.' });
    }

    const method = 'GET';
    const urlPath = `/CloudSearch/real/v1/domain/${DOMAIN_NAME}/document/search/autocomplete`;
    const timestamp = Date.now().toString();
    const accessKey = process.env.NCP_ACCESS_KEY;
    const secretKey = process.env.NCP_SECRET_KEY;

    console.log(`Method: ${method}`);
    console.log(`URL Path: ${urlPath}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`Access Key: ${accessKey}`);
    // Secret Key는 로그에 출력하지 마세요!

    const signature = makeSignature(method, urlPath, timestamp, accessKey, secretKey);

    console.log(`Signature: ${signature}`);

    const apiUrl = `https://cloudsearch.apigw.ntruss.com${urlPath}?type=${type}&query=${encodeURIComponent(query)}`;

    console.log(`API URL: ${apiUrl}`);

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'x-ncp-apigw-signature-v2': signature,
                'x-ncp-apigw-timestamp': timestamp,
                'x-ncp-iam-access-key': accessKey,
            },
        });

        console.log(`Autocomplete API Response: ${JSON.stringify(response.data)}`);

        res.json(response.data);
    } catch (error) {
        console.error('Autocomplete API Error:', error.response ? error.response.data : error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response && error.response.data ? error.response.data.message : '서버 오류가 발생했습니다.';
        res.status(status).json({ message });
    }
});

module.exports = router;
