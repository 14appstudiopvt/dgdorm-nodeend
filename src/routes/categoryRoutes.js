const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoriesByName,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Base category route info
router.get('/infoCategory', (req, res) => {
  res.json({
    message: 'Category Management API',
    endpoints: {
      createCategory: 'POST /api/categories',
      getCategories: 'GET /api/categories',
      getCategoryByName: 'GET /api/categories/name/:name',
      updateCategory: 'PUT /api/categories/:id',
      deleteCategory: 'DELETE /api/categories/:id'
    }
  });
});

// Admin-only category management
router.post('/create-category', protect, requireAdmin, upload.single('icon'), createCategory);
router.get('/get-all-category', protect, requireAdmin, getCategories);
router.get('/get-category-by-name/:name', protect, requireAdmin, getCategoriesByName);
router.put('/update-category-by-id/:id', protect, requireAdmin, updateCategory);
router.delete('/delete-category-by-id/:id', protect, requireAdmin, deleteCategory);

module.exports = router;