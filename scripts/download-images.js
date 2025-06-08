const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    url: 'https://example.com/sony-headphones.jpg',
    filename: 'sony-headphones.jpg'
  },
  {
    url: 'https://example.com/razer-keyboard.jpg',
    filename: 'razer-keyboard.jpg'
  },
  // Add more image URLs here
];

const downloadImage = (url, filename) => {
  const filepath = path.join(__dirname, '../public/images/products', filename);
  const file = fs.createWriteStream(filepath);

  https.get(url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', err => {
    fs.unlink(filepath);
    console.error(`Error downloading ${filename}:`, err.message);
  });
};

// Create directory if it doesn't exist
const dir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

// Download all images
images.forEach(image => {
  downloadImage(image.url, image.filename);
}); 