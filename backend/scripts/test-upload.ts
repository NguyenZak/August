import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const token = jwt.sign({ id: '123e4567-e89b-12d3-a456-426614174000', email: 'admin@example.com', role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

  const form = new FormData();
  const blob = new Blob(['fake image content'], { type: 'image/png' });
  form.append('files', blob, 'dummy.png');

  try {
    const res = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Error from server:", JSON.stringify(data, null, 2));
    } else {
      console.log("Success:", data);
    }
  } catch (err: any) {
    console.error("Catch Error:", err.message);
  }
}
test();
