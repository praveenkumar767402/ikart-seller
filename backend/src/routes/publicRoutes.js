const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/creators', publicController.getAllCreators);
router.get('/creators/:id', publicController.getCreatorById);
router.get('/products', publicController.getAllProducts);
router.get('/products/:id', publicController.getProductById);

module.exports = router;
