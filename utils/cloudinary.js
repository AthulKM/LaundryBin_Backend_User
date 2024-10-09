import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} imagePath - Path to the image file
 * @param {object} options - Cloudinary upload options (e.g., folder, transformation)
 * @returns {Promise<object>} - Returns the uploaded image details
 */
export const uploadImage = async (imagePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result; // The response contains image URL, public_id, etc.
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<object>} - Returns the deletion response from Cloudinary
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result; // Success response from Cloudinary
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export default cloudinary;