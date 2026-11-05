const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

router.post('/register',
  authenticate,
  authorize('admin'),                     // only admin can create users
  validate(['name', 'email', 'password']),
  asyncRoute(register)
);

router.post('/login',
  validate(['email', 'password']),
  asyncRoute(login)
);

router.get('/me', authenticate, asyncRoute(me));

module.exports = router;