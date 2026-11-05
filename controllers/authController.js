const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { signToken } = require('../utils/jwt');

// POST /api/auth/register  (admin only)
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const validRoles = ['admin', 'hr', 'employee'];
  const assignedRole = role || 'employee';

  if (!validRoles.includes(assignedRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, assignedRole]
  );

  const [[user]] = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json(user);
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, role: user.role });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
};

// GET /api/auth/me
const me = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, me };