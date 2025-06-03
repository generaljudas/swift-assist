// Script to update the password_hash for the user 'user' to 'user123'
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'zenithdata',
  password: process.env.PGPASSWORD || '',
  port: process.env.PGPORT || 5432,
});

async function updatePassword() {
  const username = 'user';
  const newPassword = 'user123';
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, username]);
  console.log(`Password hash updated for user: ${username}`);
  await pool.end();
}

updatePassword().catch(err => {
  console.error('Error updating password:', err);
  process.exit(1);
});
