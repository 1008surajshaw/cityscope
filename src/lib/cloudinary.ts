import { v2 as cloudinary } from 'cloudinary';

export const cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log('Cloudinary connected successfully');
  } catch (error) {
    console.error('Cloudinary connection error:', error);
  }
};

export const uploadImage = async (file: string): Promise<string | null> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'cityscope',
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
};

cloudinaryConnect();

export default cloudinary;