import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  }
});

export const getPlaceholderImage = (category: string): string => {
  const placeholders = {
    audio: 'ecommerce/placeholders/audio_placeholder',
    gaming: 'ecommerce/placeholders/gaming_placeholder',
    accessories: 'ecommerce/placeholders/accessories_placeholder',
    electronics: 'ecommerce/placeholders/electronics_placeholder'
  };

  const publicId = placeholders[category.toLowerCase() as keyof typeof placeholders] || 'ecommerce/placeholders/default_placeholder';

  return cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .toURL();
}; 