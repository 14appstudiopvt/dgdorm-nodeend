const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, requireAdmin } = require('../middleware/auth');

// Get user by ID
router.get('/:id', protect, userController.getUserById);

// Update user by ID
router.put('/:id', protect, userController.updateUserById);

// Delete user by ID
router.delete('/:id', protect, requireAdmin, userController.deleteUserById);

// (Optional) List all users (admin only)
router.get('/', protect, requireAdmin, userController.getAllUsers);

module.exports = router; 