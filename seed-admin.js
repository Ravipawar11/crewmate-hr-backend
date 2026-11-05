require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    ['System Admin', 'admin@crewmate.local', hash]
  );
  console.log('Admin user seeded');
  process.exit(0);
})();