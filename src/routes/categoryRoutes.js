const express = require('express');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin-only category management
router.post('/categories', protect, requireAdmin, createCategory);
router.get('/categories', protect, requireAdmin, getCategories);
router.put('/categories/:id', protect, requireAdmin, updateCategory);
router.delete('/categories/:id', protect, requireAdmin, deleteCategory);

module.exports = router;