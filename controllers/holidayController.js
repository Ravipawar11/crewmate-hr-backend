const db = require('../config/db');

// GET /api/holidays
const listHolidays = async (_req, res) => {
  const [rows] = await db.query(
    `SELECT * FROM holidays 
     WHERE YEAR(holiday_date) = YEAR(CURDATE()) 
     ORDER BY holiday_date ASC`
  );
  res.json(rows);
};

// POST /api/holidays
const createHoliday = async (req, res) => {
  const { name, holiday_date, description } = req.body;

  const [result] = await db.query(
    `INSERT INTO holidays (name, holiday_date, description) 
     VALUES (?, ?, ?)`,
    [name, holiday_date, description || null]
  );

  const [[holiday]] = await db.query('SELECT * FROM holidays WHERE id = ?', [result.insertId]);
  res.status(201).json(holiday);
};

// DELETE /api/holidays/:id
const deleteHoliday = async (req, res) => {
  const [result] = await db.query('DELETE FROM holidays WHERE id = ?', [req.params.id]);

  if (!result.affectedRows) return res.status(404).json({ message: 'Holiday not found' });
  res.status(204).send();
};

module.exports = { listHolidays, createHoliday, deleteHoliday };