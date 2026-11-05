const express = require('express');
const router = express.Router();
const { 
  listLeaves, 
  createLeave, 
  updateLeaveStatus, 
  getLeaveBalances 
} = require('../controllers/leaveController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

router.get('/', authenticate, asyncRoute(listLeaves));

// Add this NEW route
router.get('/balances', authenticate, authorize('admin', 'hr'), asyncRoute(getLeaveBalances));

router.post('/', 
  authenticate, 
  validate(['employee_id', 'leave_type', 'start_date', 'end_date']), 
  asyncRoute(createLeave)
);

router.patch('/:id/status', 
  authenticate, 
  authorize('admin', 'hr'), 
  asyncRoute(updateLeaveStatus)
);

module.exports = router;