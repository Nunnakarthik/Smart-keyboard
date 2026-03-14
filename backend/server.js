import express from 'express';
import cors from 'cors';
import translate from 'google-translate-api-x';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/translate', async (req, res) => {
  const { text, lang } = req.body;
  
  if (!text || !lang) {
    return res.status(400).json({ error: 'Missing text or lang' });
  }

  try {
    // Detect if text contains tribal scripts
    const isSantaliScript = /[\u1C50-\u1C7F]/.test(text);
    const isManipuriScript = /[\uABC0-\uABFF\uAAE0-\uAAFF]/.test(text);
    
    let sourceLangCode, targetLangCode;
    
    // If we detect tribal script characters, assume Tribal -> English
    if (isSantaliScript || isManipuriScript) {
      sourceLangCode = isSantaliScript ? 'sat' : 'mni-Mtei';
      targetLangCode = 'en';
    } else {
      // Otherwise assume English -> Selected Tribal Language
      sourceLangCode = 'en';
      targetLangCode = lang === 'Santali' ? 'sat' : 'mni-Mtei';
    }
    
    const result = await translate(text, { 
      from: sourceLangCode,
      to: targetLangCode 
    });
    // Sanitize: collapse all whitespace/newlines the API smuggles into the result
    const cleanText = (result.text || '').replace(/\s+/g, ' ').trim();
    
    res.json({ translatedText: cleanText });
  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Failed to translate' });
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Smart Keyboard Backend is running!</h1><p>Check <a href="/health">/health</a> for server status.</p>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
