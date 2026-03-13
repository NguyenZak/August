import { v2 as cloudinary } from 'cloudinary';
/**
 * Upload a file buffer to Cloudinary
 * @param fileBuffer Buffer of the file
 * @param folder Cloudinary folder name
 */
export declare const uploadToCloudinary: (fileBuffer: Buffer, folder?: string) => Promise<any>;
export default cloudinary;
//# sourceMappingURL=cloudinary.d.ts.map