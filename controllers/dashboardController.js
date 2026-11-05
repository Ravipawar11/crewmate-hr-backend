const db = require('../config/db');

const getDashboard = async (_req, res) => {
  const [[employees], [departments], [pendingLeaves], [todayAttendance]] =
    await Promise.all([
      db.query("SELECT COUNT(*) AS total FROM employees WHERE status = 'active'"),
      db.query('SELECT COUNT(*) AS total FROM departments'),
      db.query("SELECT COUNT(*) AS total FROM leave_requests WHERE status = 'pending'"),
      db.query(
        "SELECT COUNT(*) AS total FROM attendance WHERE attendance_date = CURDATE() AND status = 'present'"
      )
    ]);

  res.json({
    employees: employees[0].total,
    departments: departments[0].total,
    pendingLeaves: pendingLeaves[0].total,
    presentToday: todayAttendance[0].total
  });
};

module.exports = { getDashboard };