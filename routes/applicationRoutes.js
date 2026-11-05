const express = require('express');
const router = express.Router();
const { 
  listApplications, getApplication, createApplication, updateApplication, deleteApplication 
} = require('../controllers/applicationController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

// Only Admin and HR can manage applications
router.use(authenticate, authorize('admin', 'hr'));

router.get('/', asyncRoute(listApplications));
router.get('/:id', asyncRoute(getApplication));

router.post('/', 
  validate(['applicant_name', 'email', 'job_title', 'applied_date']),
  asyncRoute(createApplication)
);

router.put('/:id', asyncRoute(updateApplication));
router.delete('/:id', asyncRoute(deleteApplication));

module.exports = router;