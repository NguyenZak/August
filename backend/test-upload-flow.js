import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
const API_URL = 'http://localhost:4000/api';
async function testFullFlow() {
    try {
        console.log('1. Trying to login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@viz.vn',
            password: '123456'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token acquired.');
        console.log('2. Trying to upload with acquired token...');
        // Create a dummy file
        const dummyPath = './dummy.txt';
        fs.writeFileSync(dummyPath, 'test content');
        const form = new FormData();
        form.append('file', fs.createReadStream(dummyPath));
        const uploadRes = await axios.post(`${API_URL}/upload`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Upload successful!');
        console.log('Response:', uploadRes.data);
        fs.unlinkSync(dummyPath);
    }
    catch (error) {
        console.error('Flow failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
        }
        else {
            console.error(error.message);
        }
    }
}
testFullFlow();
//# sourceMappingURL=test-upload-flow.js.map