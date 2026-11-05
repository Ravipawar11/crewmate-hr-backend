const db = require('../config/db');

// GET /api/interviews
const listInterviews = async (_req, res) => {
  const [rows] = await db.query(
    `SELECT i.*, a.applicant_name, a.job_title, 
            CONCAT(e.first_name, ' ', e.last_name) AS interviewer_name
     FROM interviews i
     JOIN applications a ON a.id = i.application_id
     LEFT JOIN employees e ON e.id = i.interviewer_id
     ORDER BY i.interview_date DESC`
  );
  res.json(rows);
};

// POST /api/interviews
const createInterview = async (req, res) => {
  const { application_id, interview_date, interview_type, interviewer_id, notes } = req.body;

  const [result] = await db.query(
    `INSERT INTO interviews 
     (application_id, interview_date, interview_type, interviewer_id)
     VALUES (?, ?, ?, ?)`,
    [application_id, interview_date, interview_type, interviewer_id || null]
  );

  // Auto-update application status to 'interviewing' if it was 'applied' or 'screening'
  await db.query(
    `UPDATE applications SET status = 'interviewing' 
     WHERE id = ? AND status IN ('applied', 'screening')`,
    [application_id]
  );

  const [[interview]] = await db.query('SELECT * FROM interviews WHERE id = ?', [result.insertId]);
  res.status(201).json(interview);
};

// PATCH /api/interviews/:id/status
const updateInterviewStatus = async (req, res) => {
  const { status, feedback, rating } = req.body;
  
  const validStatuses = ['scheduled', 'completed', 'cancelled', 'no_show'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid interview status' });
  }

  const [result] = await db.query(
    `UPDATE interviews SET status=?, feedback=?, rating=? WHERE id=?`,
    [status, feedback || null, rating || null, req.params.id]
  );

  if (!result.affectedRows) return res.status(404).json({ message: 'Interview not found' });
  res.json({ message: 'Interview updated successfully' });
};

module.exports = { listInterviews, createInterview, updateInterviewStatus };