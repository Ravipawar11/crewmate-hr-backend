const express = require('express');
const router = express.Router();
const { listAttendance, saveAttendance } = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

router.get('/', authenticate, asyncRoute(listAttendance));

router.post('/',
  authenticate,
  authorize('admin', 'hr'),                // employees cannot mark their own attendance here
  validate(['employee_id', 'attendance_date', 'status']),
  asyncRoute(saveAttendance)
);

module.exports = router;