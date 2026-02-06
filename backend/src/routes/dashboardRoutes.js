const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

router.get('/stats', auth, dashboardController.getStats);
router.get('/profile', auth, dashboardController.getProfile);
router.put('/profile', auth, upload.single('image'), dashboardController.updateProfile);

module.exports = router;
