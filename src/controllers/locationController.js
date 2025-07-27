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

    // Collect matching country and city suggestions with lat/long
    const suggestions = [];
    countries.forEach(country => {
      if (country.name.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'country',
          name: country.name,
          lat: country.lat,
          long: country.long
        });
      }
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'city',
            name: city.name,
            lat: city.lat,
            long: city.long,
            country: country.name
          });
        }
      });
    });

    // Remove duplicates by name and type
    const uniqueSuggestions = suggestions.filter((sugg, idx, arr) =>
      arr.findIndex(s => s.name === sugg.name && s.type === sugg.type) === idx
    );
    res.json({ success: true, suggestions: uniqueSuggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 