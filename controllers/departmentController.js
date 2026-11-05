const db = require('../config/db');

const listDepartments = async (_req, res) => {
  const [rows] = await db.query('SELECT * FROM departments ORDER BY name');
  res.json(rows);
};

const createDepartment = async (req, res) => {
  const { name, description } = req.body;

  const [result] = await db.query(
    'INSERT INTO departments (name, description) VALUES (?, ?)',
    [name, description || null]
  );

  const [[department]] = await db.query(
    'SELECT * FROM departments WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json(department);
};

module.exports = { listDepartments, createDepartment };