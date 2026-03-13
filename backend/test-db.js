const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    const res = await pool.query('SELECT * FROM media LIMIT 1;');
    console.log("Success! Columns:", res.fields.map(f => f.name));
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    pool.end();
  }
}
test();
