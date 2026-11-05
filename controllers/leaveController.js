const db = require('../config/db');

const listLeaves = async (req, res) => {
  const isPrivileged = ['admin', 'hr'].includes(req.user.role);

  const [rows] = await db.query(
    `SELECT l.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name
     FROM leave_requests l
     JOIN employees e ON e.id = l.employee_id
     ${isPrivileged ? '' : 'WHERE e.email = ?'}
     ORDER BY l.created_at DESC`,
    isPrivileged ? [] : [req.user.email]
  );

  res.json(rows);
};

const createLeave = async (req, res) => {
  const { employee_id, leave_type, start_date, end_date, reason } = req.body;

  const [result] = await db.query(
    'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)',
    [employee_id, leave_type, start_date, end_date, reason || null]
  );

  res.status(201).json({ id: result.insertId, message: 'Leave request created' });
};

const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  const [result] = await db.query(
    'UPDATE leave_requests SET status = ? WHERE id = ?',
    [status, req.params.id]
  );

  if (!result.affectedRows)
    return res.status(404).json({ message: 'Leave request not found' });

  res.json({ message: 'Leave status updated' });
};

const getLeaveBalances = async (_req, res) => {
  // 1. Define company allowance policy
  const allowances = { casual: 12, sick: 12, annual: 15 };

  // 2. Fetch all active employees
  const [employees] = await db.query(
    "SELECT id, employee_code, first_name, last_name FROM employees WHERE status = 'active'"
  );

  // 3. Fetch all approved leaves for the current year
  const [approvedLeaves] = await db.query(
    `SELECT employee_id, leave_type, DATEDIFF(end_date, start_date) + 1 AS days 
     FROM leave_requests 
     WHERE status = 'approved' AND YEAR(start_date) = YEAR(CURDATE())`
  );

  // 4. Calculate balances
  const balances = employees.map(emp => {
    const result = {
      employee_id: emp.id,
      employee_code: emp.employee_code,
      employee_name: `${emp.first_name} ${emp.last_name}`,
      casual: { total: allowances.casual, used: 0, remaining: allowances.casual },
      sick: { total: allowances.sick, used: 0, remaining: allowances.sick },
      annual: { total: allowances.annual, used: 0, remaining: allowances.annual }
    };

    // Sum up the used leaves for this specific employee
    approvedLeaves.forEach(leave => {
      if (leave.employee_id === emp.id && result[leave.leave_type]) {
        result[leave.leave_type].used += leave.days;
        result[leave.leave_type].remaining -= leave.days;
      }
    });

    return result;
  });

  res.json(balances);
};

module.exports = { listLeaves, createLeave, updateLeaveStatus, getLeaveBalances };