const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');
const asyncRoute = require('../utils/asyncRoute');

// Any logged-in user can view dashboard
router.get('/', authenticate, asyncRoute(getDashboard));

module.exports = router;