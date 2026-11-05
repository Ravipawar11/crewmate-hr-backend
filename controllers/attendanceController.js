const db = require('../config/db');

const listAttendance = async (req, res) => {
  const { date } = req.query;

  // Employees can only view their own attendance
  const isPrivileged = ['admin', 'hr'].includes(req.user.role);

  const [rows] = await db.query(
    `SELECT a.*, e.employee_code, CONCAT(e.first_name, ' ', e.last_name) AS employee_name
     FROM attendance a
     JOIN employees e ON e.id = a.employee_id
     WHERE a.attendance_date = COALESCE(?, CURDATE())
       ${isPrivileged ? '' : 'AND e.email = ?'}
     ORDER BY employee_name`,
    isPrivileged ? [date || null] : [date || null, req.user.email]
  );

  res.json(rows);
};

const saveAttendance = async (req, res) => {
  const { employee_id, attendance_date, status, check_in, check_out, notes } = req.body;

  await db.query(
    `INSERT INTO attendance (employee_id, attendance_date, status, check_in, check_out, notes)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       status=VALUES(status), check_in=VALUES(check_in),
       check_out=VALUES(check_out), notes=VALUES(notes)`,
    [
      employee_id, attendance_date, status,
      check_in || null, check_out || null, notes || null
    ]
  );

  res.status(201).json({ message: 'Attendance saved' });
};

module.exports = { listAttendance, saveAttendance };