#!/bin/bash

# Set Cloudinary credentials
export NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=demo
export CLOUDINARY_API_KEY=your_api_key
export CLOUDINARY_API_SECRET=your_api_secret

# Run the upload script
node upload-placeholders.js 