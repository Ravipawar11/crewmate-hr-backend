const db = require('../config/db');

const listAnnouncements = async (_req, res) => {
  const [rows] = await db.query(
    `SELECT a.*, u.name AS author_name 
     FROM announcements a 
     JOIN users u ON u.id = a.posted_by 
     ORDER BY a.created_at DESC`
  );
  res.json(rows);
};

const createAnnouncement = async (req, res) => {
  const { title, content } = req.body;
  const [result] = await db.query(
    'INSERT INTO announcements (title, content, posted_by) VALUES (?, ?, ?)',
    [title, content, req.user.id] // req.user.id comes from authMiddleware
  );
  const [[announcement]] = await db.query('SELECT * FROM announcements WHERE id = ?', [result.insertId]);
  res.status(201).json(announcement);
};

const deleteAnnouncement = async (req, res) => {
  const [result] = await db.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
};

module.exports = { listAnnouncements, createAnnouncement, deleteAnnouncement };