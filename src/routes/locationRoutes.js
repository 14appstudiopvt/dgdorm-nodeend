// src/routes/locationRoutes.js

const express = require('express');
const router = express.Router();
const { searchLocations } = require('../controllers/locationController');

// GET /api/locations/search
router.get('/search', searchLocations);

module.exports = router; 