const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  filterProperties,
  addFavorite,
  getFavorites,
  getOwnerProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByStatus,
  approveProperty,
  rejectProperty,
  banOwner,
  getAllUsers,
  getAllOwners,
  getAllProperties,
} = require('../controllers/propertyController');
const { protect, requireAdmin, requireOwner } = require('../middleware/auth'); // Assuming requireOwner middleware exists
const upload = require('../middleware/upload');

// --- Public Property Routes ---
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.post('/properties/filter', filterProperties);

// --- User Favorite Routes ---
router.post('/users/:id/favorites', protect, addFavorite);
router.get('/users/:id/favorites', protect, getFavorites);

// --- Owner Property Routes ---
router.get('/owner/properties', protect, requireOwner, getOwnerProperties);
router.post('/properties', protect, requireOwner, upload.array('images', 10), createProperty);
router.put('/owner/properties/:id', protect, requireOwner, upload.array('images', 10), updateProperty);
router.delete('/owner/properties/:id', protect, requireOwner, deleteProperty);

// --- Admin Moderation Routes ---
router.get('/admin/properties', protect, requireAdmin, getPropertiesByStatus);
router.post('/admin/properties/:id/approve', protect, requireAdmin, approveProperty);
router.post('/admin/properties/:id/reject', protect, requireAdmin, rejectProperty);
router.post('/admin/owners/:id/ban', protect, requireAdmin, banOwner);

// --- Extra Admin APIs ---
router.get('/admin/users', protect, requireAdmin, getAllUsers);
router.get('/admin/owners', protect, requireAdmin, getAllOwners);
router.get('/admin/all-properties', protect, requireAdmin, getAllProperties);

module.exports = router; 