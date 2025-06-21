const express = require('express');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Base category route info
router.get('/', (req, res) => {
  res.json({
    message: 'Category Management API',
    endpoints: {
      createCategory: 'POST /api/categories',
      getCategories: 'GET /api/categories',
      updateCategory: 'PUT /api/categories/:id',
      deleteCategory: 'DELETE /api/categories/:id'
    }
  });
});

// Admin-only category management
router.post('/', protect, requireAdmin, createCategory);
router.get('/', protect, requireAdmin, getCategories);
router.get('/name/:name', protect, requireAdmin, getCategoryByName);
router.put('/:id', protect, requireAdmin, updateCategory);
router.delete('/:id', protect, requireAdmin, deleteCategory);

module.exports = router;