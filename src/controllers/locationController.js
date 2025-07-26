// src/controllers/locationController.js

const Country = require('../models/Country');

exports.searchLocations = async (req, res) => {
  const query = req.query.query?.toLowerCase() || '';
  if (!query) {
    return res.json({ success: true, suggestions: [] });
  }
  try {
    // Find countries whose name or any city name matches the query
    const countries = await Country.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { 'cities.name': { $regex: query, $options: 'i' } }
      ]
    });

    // Collect matching country names and city names
    const suggestions = [];
    countries.forEach(country => {
      if (country.name.toLowerCase().includes(query)) {
        suggestions.push(country.name);
      }
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(query)) {
          suggestions.push(city.name);
        }
      });
    });

    // Remove duplicates
    const uniqueSuggestions = [...new Set(suggestions)];
    res.json({ success: true, suggestions: uniqueSuggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 