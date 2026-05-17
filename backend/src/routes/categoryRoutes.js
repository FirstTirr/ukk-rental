const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categoryControllers');

router.get('/read/category', categoryControllers.getAllCategories);
router.get('/read/category/:id', categoryControllers.getCategoryById);
router.post('/category', categoryControllers.createCategory);
router.put('/edit/category/:id', categoryControllers.updateCategory);
router.delete('/delete/category/:id', categoryControllers.deleteCategory);

module.exports = router;