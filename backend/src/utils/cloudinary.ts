import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

/**
 * Upload a file buffer to Cloudinary
 * @param fileBuffer Buffer of the file
 * @param folder Cloudinary folder name
 */
export const uploadToCloudinary = (fileBuffer: Buffer, folder: string = 'august-cms'): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
                // Chỉ áp dụng biến đổi nếu là ảnh, tránh lỗi cho PDF/Video
                // Cloudinary sẽ tự động phát hiện resource_type
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;
