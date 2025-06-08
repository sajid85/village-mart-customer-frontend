const axios = require('axios');

// Product images mapping with Unsplash URLs
const productImages = {
  'audio': [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&w=800',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&w=800',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&w=800',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&w=800'
  ],
  'gaming': [
    'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&w=800',
    'https://images.unsplash.com/photo-1616248304589-6a3d8d60ad7d?auto=format&w=800',
    'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?auto=format&w=800',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&w=800'
  ],
  'electronics': [
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&w=800',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&w=800',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&w=800',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&w=800'
  ],
  'accessories': [
    'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&w=800',
    'https://images.unsplash.com/photo-1561883088-039e53143d73?auto=format&w=800',
    'https://images.unsplash.com/photo-1596774105710-8e3f98097d65?auto=format&w=800',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&w=800'
  ]
};

async function updateProductImages() {
  try {
    // Get all products
    const response = await axios.get('http://localhost:3005/products');
    const products = response.data;

    for (const product of products) {
      try {
        // Get random image URL for the product's category
        const categoryImages = productImages[product.category.toLowerCase()];
        if (!categoryImages) {
          console.log(`No images found for category ${product.category}, skipping...`);
          continue;
        }

        const randomImageUrl = categoryImages[Math.floor(Math.random() * categoryImages.length)];

        // Update product in database
        console.log(`Updating image for ${product.name}...`);
        await axios.patch(`http://localhost:3005/products/${product.id}`, {
          imageUrl: randomImageUrl
        });

        console.log(`✓ Updated ${product.name} with image: ${randomImageUrl}`);
      } catch (error) {
        console.error(`Failed to process ${product.name}:`, error.message);
      }
    }

    console.log('All product images updated!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateProductImages(); 