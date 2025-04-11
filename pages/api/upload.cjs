const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT =4000;

// Enable CORS
app.use(cors());

// Create storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'toanalyze/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  return res.json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    path: req.file.path,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
