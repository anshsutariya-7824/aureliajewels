const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'images');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename while preserving extension
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    cb(null, `${baseName}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    
    if (allowedTypes.test(ext) && allowedTypes.test(mimeType)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed (jpg, jpeg, png, gif, webp, svg)'));
    }
  }
});

// Helper paths
const productsFilePath = path.join(__dirname, 'js', 'products-data.js');
const contentFilePath = path.join(__dirname, 'js', 'site-content.js');

// Helper to load products data dynamically (bypassing require cache)
function loadProductsData() {
  if (!fs.existsSync(productsFilePath)) {
    return { PRODUCTS_DATA: [], DIAMONDS_DATA: [] };
  }
  try {
    delete require.cache[require.resolve('./js/products-data.js')];
    const data = require('./js/products-data.js');
    return data;
  } catch (err) {
    console.error('Error requiring products-data.js:', err);
    // Fallback parsing if require fails
    return { PRODUCTS_DATA: [], DIAMONDS_DATA: [] };
  }
}

// Helper to load site content dynamically
function loadSiteContent() {
  if (!fs.existsSync(contentFilePath)) {
    return { SITE_CONTENT: {} };
  }
  try {
    delete require.cache[require.resolve('./js/site-content.js')];
    const data = require('./js/site-content.js');
    return data;
  } catch (err) {
    console.error('Error requiring site-content.js:', err);
    return { SITE_CONTENT: {} };
  }
}

// --- API Endpoints ---

// 1. Get Products & Diamonds
app.get('/api/products', (req, res) => {
  try {
    const data = loadProductsData();
    res.json({
      success: true,
      products: data.PRODUCTS_DATA || [],
      diamonds: data.DIAMONDS_DATA || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Save Products & Diamonds
app.post('/api/products', (req, res) => {
  try {
    const { products, diamonds } = req.body;
    if (!Array.isArray(products) || !Array.isArray(diamonds)) {
      return res.status(400).json({ success: false, message: 'Invalid products or diamonds array' });
    }

    const fileContent = `/**
 * AURELIA Jewelry Exports - Central B2B Product Database
 */
const PRODUCTS_DATA = ${JSON.stringify(products, null, 2)};

const DIAMONDS_DATA = ${JSON.stringify(diamonds, null, 2)};

// Export for browser script usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS_DATA, DIAMONDS_DATA };
}
`;

    fs.writeFileSync(productsFilePath, fileContent, 'utf-8');
    res.json({ success: true, message: 'Products and diamonds updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Get Site Content
app.get('/api/content', (req, res) => {
  try {
    const data = loadSiteContent();
    res.json({
      success: true,
      content: data.SITE_CONTENT || {}
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Save Site Content
app.post('/api/content', (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid content object' });
    }

    const fileContent = `/**
 * AURELIA Jewelry Exports - Dynamic Page Content
 */
const SITE_CONTENT = ${JSON.stringify(content, null, 2)};

// Export for browser script usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SITE_CONTENT };
}
`;

    fs.writeFileSync(contentFilePath, fileContent, 'utf-8');
    res.json({ success: true, message: 'Site content updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Upload Image
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const relativePath = `images/${req.file.filename}`;
    res.json({
      success: true,
      filepath: relativePath,
      filename: req.file.filename
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. List all images in the /images folder
app.get('/api/images', (req, res) => {
  try {
    const imagesDir = path.join(__dirname, 'images');
    if (!fs.existsSync(imagesDir)) {
      return res.json({ success: true, images: [] });
    }
    const files = fs.readdirSync(imagesDir);
    // Filter to only include image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const images = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map(file => ({
        filename: file,
        url: `images/${file}`
      }));
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` AURELIA LOCAL DEV SERVER RUNNING`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Admin URL: http://localhost:${PORT}/admin.html`);
  console.log(`=================================================`);
});
