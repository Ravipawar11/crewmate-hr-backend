const express = require('express');
const router = express.Router();
const { listAnnouncements, createAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validate');
const asyncRoute = require('../utils/asyncRoute');

router.get('/', authenticate, asyncRoute(listAnnouncements));
router.post('/', authenticate, authorize('admin', 'hr'), validate(['title', 'content']), asyncRoute(createAnnouncement));
router.delete('/:id', authenticate, authorize('admin', 'hr'), asyncRoute(deleteAnnouncement));

module.exports = router;