const express = require('express');
const router = express.Router();
const { listHolidays, createHoliday, deleteHoliday } = require('../controllers/holidayController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

router.get('/', authenticate, asyncRoute(listHolidays));

router.post('/', 
  authenticate, 
  authorize('admin', 'hr'), 
  validate(['name', 'holiday_date']), 
  asyncRoute(createHoliday)
);

router.delete('/:id', 
  authenticate, 
  authorize('admin', 'hr'), 
  asyncRoute(deleteHoliday)
);

module.exports = router;