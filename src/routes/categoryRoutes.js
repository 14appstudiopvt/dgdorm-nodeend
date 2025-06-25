const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoryByName,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, requireAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Info route
router.get('/infoCategory', (req, res) => {
  res.json({
    message: 'Category Management API',
    endpoints: {
      createCategory: 'POST /api/categories/create-category',
      getCategories: 'GET /api/categories/get-all-category',
      getCategoryByName: 'GET /api/categories/get-category-by-name/:name',
      updateCategory: 'PUT /api/categories/update-category-by-id/:id',
      deleteCategory: 'DELETE /api/categories/delete-category-by-id/:id'
    }
  });
});

// Admin-only category management
router.post('/create-category', protect, requireAdmin, upload.single('icon'), createCategory);
router.get('/get-all-category', protect, requireAdmin, getCategories);
router.get('/get-category-by-name/:name', protect, requireAdmin, getCategoryByName);
router.put('/update-category-by-id/:id', protect, requireAdmin, updateCategory);
router.delete('/delete-category-by-id/:id', protect, requireAdmin, deleteCategory);

module.exports = router;