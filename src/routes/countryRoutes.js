const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

// Country CRUD
router.post('/countries', countryController.addCountry);
router.get('/countries', countryController.getCountries);
router.put('/countries/:id', countryController.updateCountry);
router.delete('/countries/:id', countryController.deleteCountry);

// City CRUD within a country
router.post('/countries/:countryId/cities', countryController.addCity);
router.put('/countries/:countryId/cities/:cityId', countryController.updateCity);
router.delete('/countries/:countryId/cities/:cityId', countryController.deleteCity);

// Dropdown API
router.get('/dropdown', countryController.getDropdown);

// Search API for countries and cities
router.get('/search', countryController.searchCountriesAndCities);

module.exports = router; 