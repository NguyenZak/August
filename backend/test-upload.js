const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

async function test() {
  const token = jwt.sign({ id: 1, email: 'admin@example.com', role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
  const form = new FormData();
  fs.writeFileSync('dummy.txt', 'hello');
  form.append('files', fs.createReadStream('dummy.txt'));
  
  try {
    const res = await axios.post('http://localhost:4000/api/upload', form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` }
    });
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.error("Error from server:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}
test();
