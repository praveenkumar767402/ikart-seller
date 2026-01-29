const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/stats', auth, dashboardController.getStats);
router.get('/profile', auth, dashboardController.getProfile);
router.put('/profile', auth, dashboardController.updateProfile);

module.exports = router;
