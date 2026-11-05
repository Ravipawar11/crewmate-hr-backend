const db = require('../config/db');

// GET /api/applications
const listApplications = async (_req, res) => {
  const [rows] = await db.query(
    `SELECT a.*, d.name AS department_name
     FROM applications a
     LEFT JOIN departments d ON d.id = a.department_id
     ORDER BY a.created_at DESC`
  );
  res.json(rows);
};

// GET /api/applications/:id
const getApplication = async (req, res) => {
  const [[application]] = await db.query(
    `SELECT a.*, d.name AS department_name
     FROM applications a
     LEFT JOIN departments d ON d.id = a.department_id
     WHERE a.id = ?`,
    [req.params.id]
  );

  if (!application) return res.status(404).json({ message: 'Application not found' });
  
  // Fetch associated interviews
  const [interviews] = await db.query(
    `SELECT i.*, CONCAT(e.first_name, ' ', e.last_name) AS interviewer_name
     FROM interviews i
     LEFT JOIN employees e ON e.id = i.interviewer_id
     WHERE i.application_id = ?
     ORDER BY i.interview_date DESC`,
    [req.params.id]
  );

  res.json({ ...application, interviews });
};

// POST /api/applications
const createApplication = async (req, res) => {
  const { applicant_name, email, phone, job_title, department_id, resume_url, applied_date, notes } = req.body;

  const [result] = await db.query(
    `INSERT INTO applications 
     (applicant_name, email, phone, job_title, department_id, resume_url, applied_date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [applicant_name, email, phone || null, job_title, department_id || null, resume_url || null, applied_date, notes || null]
  );

  const [[application]] = await db.query('SELECT * FROM applications WHERE id = ?', [result.insertId]);
  res.status(201).json(application);
};

// PUT /api/applications/:id
const updateApplication = async (req, res) => {
  const { applicant_name, email, phone, job_title, department_id, resume_url, status, applied_date, notes } = req.body;

  const [result] = await db.query(
    `UPDATE applications SET 
      applicant_name=?, email=?, phone=?, job_title=?, department_id=?, 
      resume_url=?, status=?, applied_date=?, notes=?
     WHERE id=?`,
    [applicant_name, email, phone || null, job_title, department_id || null, resume_url || null, status, applied_date, notes || null, req.params.id]
  );

  if (!result.affectedRows) return res.status(404).json({ message: 'Application not found' });

  const [[application]] = await db.query('SELECT * FROM applications WHERE id = ?', [req.params.id]);
  res.json(application);
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  const [result] = await db.query('DELETE FROM applications WHERE id = ?', [req.params.id]);

  if (!result.affectedRows) return res.status(404).json({ message: 'Application not found' });
  res.status(204).send();
};

module.exports = {
  listApplications, getApplication, createApplication, updateApplication, deleteApplication
};  