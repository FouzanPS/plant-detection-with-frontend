const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const PORT = 4050;

const ANALYZE_FOLDER = path.join(__dirname, '..', '..', 'toanalyze');

const FLASK_API_URL = 'http://127.0.0.1:5000/checkdisease';

app.use(cors());
app.use(express.json());

app.post('/api/analyze-disease', async (req, res) => {
  try {
    const files = fs.readdirSync(ANALYZE_FOLDER).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg'].includes(ext);
    });

    if (files.length === 0) {
      return res.status(400).json({ error: 'No supported image files found in toanalyze folder' });
    }

    const filePath = path.join(ANALYZE_FOLDER, files[0]);

    const form = new FormData();
    form.append('image', fs.createReadStream(filePath));

    const response = await fetch(FLASK_API_URL, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();

    // Delete image after processing
    fs.unlinkSync(filePath);

    // Return prediction with confidence in percentage
    res.json({
      result: data.prediction || 'Unknown',
      confidence: data.confidence ? Math.round(data.confidence * 100) : 0
    });

  } catch (err) {
    console.error('Error during disease analysis:', err);
    res.status(500).json({ error: 'Failed to analyze disease.' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
});

