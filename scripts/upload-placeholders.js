const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const placeholders = [
  {
    category: 'audio',
    publicId: 'ecommerce/placeholders/audio_placeholder',
    file: path.join(__dirname, '../public/product-images/headphones-1.jpg')
  },
  {
    category: 'gaming',
    publicId: 'ecommerce/placeholders/gaming_placeholder',
    file: path.join(__dirname, '../public/product-images/keyboard-1.jpg')
  },
  {
    category: 'accessories',
    publicId: 'ecommerce/placeholders/accessories_placeholder',
    file: path.join(__dirname, '../public/product-images/webcam-1.jpg')
  },
  {
    category: 'electronics',
    publicId: 'ecommerce/placeholders/electronics_placeholder',
    file: path.join(__dirname, '../public/product-images/speaker-1.jpg')
  }
];

async function uploadPlaceholders() {
  try {
    for (const placeholder of placeholders) {
      console.log(`Uploading ${placeholder.category} placeholder...`);
      const result = await cloudinary.uploader.upload(placeholder.file, {
        public_id: placeholder.publicId,
        overwrite: true
      });
      console.log(`✓ Uploaded ${placeholder.category} placeholder: ${result.secure_url}`);
    }

    // Upload default placeholder
    console.log('Uploading default placeholder...');
    const result = await cloudinary.uploader.upload(
      path.join(__dirname, '../public/product-images/speaker-1.jpg'),
      {
        public_id: 'ecommerce/placeholders/default_placeholder',
        overwrite: true
      }
    );
    console.log(`✓ Uploaded default placeholder: ${result.secure_url}`);

    console.log('All placeholders uploaded successfully!');
  } catch (error) {
    console.error('Error uploading placeholders:', error);
    process.exit(1);
  }
}

uploadPlaceholders(); 