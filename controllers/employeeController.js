const db = require('../config/db');

// Helper function to format date correctly for MySQL (YYYY-MM-DD)
const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;
  // If it's already in YYYY-MM-DD format, return it directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  // Otherwise, parse the ISO string and extract YYYY-MM-DD
  return new Date(dateString).toISOString().split('T')[0];
};

const listEmployees = async (_req, res) => {
  const [rows] = await db.query(
    `SELECT e.*, d.name AS department_name
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     ORDER BY e.created_at DESC`
  );
  res.json(rows);
};

const getEmployee = async (req, res) => {
  const [[employee]] = await db.query(
    `SELECT e.*, d.name AS department_name
     FROM employees e
     LEFT JOIN departments d ON d.id = e.department_id
     WHERE e.id = ?`,
    [req.params.id]
  );

  if (!employee) return res.status(404).json({ message: 'Employee not found' });
  res.json(employee);
};

const createEmployee = async (req, res) => {
  const {
    employee_code, first_name, last_name, email,
    phone, department_id, job_title, joining_date, salary
  } = req.body;

  // Format the date before inserting
  const safeJoiningDate = formatDateForMySQL(joining_date);

  const [result] = await db.query(
    `INSERT INTO employees
      (employee_code, first_name, last_name, email, phone, department_id, job_title, joining_date, salary)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employee_code, first_name, last_name, email,
      phone || null, department_id || null, job_title || null,
      safeJoiningDate, salary || 0
    ]
  );

  const [[employee]] = await db.query(
    'SELECT * FROM employees WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json(employee);
};

const updateEmployee = async (req, res) => {
  const {
    first_name, last_name, email, phone, department_id,
    job_title, joining_date, salary, status
  } = req.body;

  // Format the date before updating
  const safeJoiningDate = formatDateForMySQL(joining_date);

  const [result] = await db.query(
    `UPDATE employees SET
       first_name=?, last_name=?, email=?, phone=?, department_id=?,
       job_title=?, joining_date=?, salary=?, status=?
     WHERE id=?`,
    [
      first_name, last_name, email, phone || null,
      department_id || null, job_title || null, safeJoiningDate,
      salary || 0, status || 'active', req.params.id
    ]
  );

  if (!result.affectedRows)
    return res.status(404).json({ message: 'Employee not found' });

  const [[employee]] = await db.query(
    'SELECT * FROM employees WHERE id = ?',
    [req.params.id]
  );
  res.json(employee);
};

const deleteEmployee = async (req, res) => {
  const [result] = await db.query(
    'DELETE FROM employees WHERE id = ?',
    [req.params.id]
  );

  if (!result.affectedRows)
    return res.status(404).json({ message: 'Employee not found' });

  res.status(204).send();
};

module.exports = {
  listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee
};