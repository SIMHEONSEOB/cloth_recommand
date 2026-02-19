// 간단한 프록시 서버 - API 키 보호용
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Gemini API 프록시 엔드포인트
app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCUI21G9fFFuBpdA7jD3bG4BbTXOpl3z_M`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('프록시 서버 오류:', error);
        res.status(500).json({ error: '서버 오류' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`프록시 서버 실행 중: http://localhost:${PORT}`);
});
