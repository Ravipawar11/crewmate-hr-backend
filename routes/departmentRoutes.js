const express = require('express');
const router = express.Router();
const { listDepartments, createDepartment } = require('../controllers/departmentController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

router.get('/', authenticate, asyncRoute(listDepartments));

router.post('/',
  authenticate,
  authorize('admin', 'hr'),                // admin & hr can create
  validate(['name']),
  asyncRoute(createDepartment)
);

module.exports = router;