const express = require('express');
const router = express.Router();
const { listInterviews, createInterview, updateInterviewStatus } = require('../controllers/interviewController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

// Only Admin and HR can manage interviews
router.use(authenticate, authorize('admin', 'hr'));

router.get('/', asyncRoute(listInterviews));

router.post('/', 
  validate(['application_id', 'interview_date', 'interview_type']),
  asyncRoute(createInterview)
);

router.patch('/:id/status', asyncRoute(updateInterviewStatus));

module.exports = router;