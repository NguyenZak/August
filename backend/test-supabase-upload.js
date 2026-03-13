import { uploadToSupabase } from './src/utils/supabase-storage.js';
import fs from 'fs';
async function test() {
    try {
        console.log('Testing Supabase Upload...');
        const tempFile = 'test-file.txt';
        fs.writeFileSync(tempFile, 'Hello Supabase Storage!');
        const result = await uploadToSupabase(tempFile, 'test-file.txt');
        console.log('Upload Success:', result);
        fs.unlinkSync(tempFile);
        process.exit(0);
    }
    catch (error) {
        console.error('Upload Failed:', error);
        process.exit(1);
    }
}
test();
//# sourceMappingURL=test-supabase-upload.js.map