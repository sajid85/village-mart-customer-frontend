const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'demo',
  api_key: '686921933985589',
  api_secret: 'wUEM5wh3XEK-GRexLXse7QYr-L8'
});

// Product images mapping
const productImages = {
  'Sony WH-1000XM4': 'headphones-1.jpg',
  'Razer BlackWidow V3': 'keyboard-1.jpg',
  'Logitech C920x HD Pro': 'webcam-1.jpg',
  'Bose SoundLink Revolve+': 'speaker-1.jpg',
  // Add more product-to-image mappings here
};

async function uploadProductImages() {
  try {
    // Get all products
    const response = await axios.get('http://localhost:3005/products');
    const products = response.data;

    for (const product of products) {
      try {
        // Get the image filename for this product
        const imageFile = productImages[product.name];
        
        if (!imageFile) {
          console.log(`No image mapping found for ${product.name}, skipping...`);
          continue;
        }

        const imagePath = path.join(__dirname, '../public/product-images', imageFile);

        // Upload to Cloudinary
        console.log(`Uploading image for ${product.name}...`);
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: `ecommerce/products/${product.category.toLowerCase()}`,
          public_id: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          overwrite: true
        });

        // Update product in database
        await axios.patch(`http://localhost:3005/products/${product.id}`, {
          imageUrl: result.secure_url
        });

        console.log(`✓ Updated ${product.name} with image: ${result.secure_url}`);
      } catch (error) {
        console.error(`Failed to process ${product.name}:`, error.message);
      }
    }

    console.log('All product images processed!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

uploadProductImages(); 