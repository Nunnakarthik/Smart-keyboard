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
    // Map our app's languages to Google Translate codes
    const targetLangCode = lang === 'Santali' ? 'sat' : 'mni-Mtei';
    
    const result = await translate(text, { to: targetLangCode });
    // Sanitize: collapse all whitespace/newlines the API smuggles into the result
    const cleanText = (result.text || '').replace(/\s+/g, ' ').trim();
    
    res.json({ translatedText: cleanText });
  } catch (error) {
    console.error('Translation Error:', error);
    res.status(500).json({ error: 'Failed to translate' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
