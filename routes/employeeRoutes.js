const express = require('express');
const router = express.Router();
const {
  listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee
} = require('../controllers/employeeController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

router.get('/', authenticate, asyncRoute(listEmployees));
router.get('/:id', authenticate, asyncRoute(getEmployee));

router.post('/',
  authenticate,
  authorize('admin', 'hr'),
  validate(['employee_code', 'first_name', 'last_name', 'email', 'joining_date']),
  asyncRoute(createEmployee)
);

router.put('/:id',
  authenticate,
  authorize('admin', 'hr'),
  asyncRoute(updateEmployee)
);

router.delete('/:id',
  authenticate,
  authorize('admin'),                      // only admin can delete
  asyncRoute(deleteEmployee)
);

module.exports = router;