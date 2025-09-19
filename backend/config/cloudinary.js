import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        // Convert buffer to base64
        const b64 = buffer.toString('base64');
        const dataURI = `data:image/jpeg;base64,${b64}`;
        
        cloudinary.uploader.upload(dataURI, {
            folder: 'echochat_profiles',
            resource_type: 'auto'
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return reject(error);
            }
            resolve(result.secure_url);
        });
    });
};

export default cloudinary;