import 'dotenv/config';
import mysql from 'mysql2/promise';
import crypto from 'crypto';

function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

async function setAdminCredentials() {
  const email = process.argv[2] || 'sirroshan999@gmail.com';
  const password = process.argv[3] || '789257';

  console.log(`\n🔐 Setting Admin Credentials in MySQL for: ${email}`);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sagar123',
    database: process.env.DB_NAME || 'newport',
  });

  const { hash, salt } = hashPassword(password);

  await conn.execute(`
    INSERT INTO \`admin_users\` (id, email, password_hash, password_salt, role)
    VALUES ('admin-master', ?, ?, ?, 'SuperAdmin')
    ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      password_hash = VALUES(password_hash),
      password_salt = VALUES(password_salt),
      role = 'SuperAdmin'
  `, [email, hash, salt]);

  console.log(`✅ Success! Admin credentials updated in MySQL:`);
  console.log(`   📧 Email:    ${email}`);
  console.log(`   🔑 Password: [PROTECTED AND HASHED]`);
  console.log(`   🛡️  Hash:     ${hash.slice(0, 32)}... (PBKDF2 SHA-512)`);
  console.log(`\n👉 You can now log in at: http://localhost:3001\n`);

  await conn.end();
}

setAdminCredentials().catch((err) => {
  console.error('❌ Error updating admin credentials:', err.message);
  process.exit(1);
});

