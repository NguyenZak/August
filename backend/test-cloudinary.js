import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function testUpload() {
    console.log('Testing Cloudinary upload with credentials:');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY);
    console.log('API Secret:', '***' + process.env.CLOUDINARY_API_SECRET?.slice(-4));
    try {
        const result = await cloudinary.uploader.upload('https://cloudinary-devs.github.io/reusable-assets/pineapple.jpg', {
            folder: 'test-connection',
        });
        console.log('Successfully uploaded test image:');
        console.log(result.secure_url);
    }
    catch (error) {
        console.error('Upload failed with error:');
        console.error(error);
    }
}
testUpload();
//# sourceMappingURL=test-cloudinary.js.map