const Country = require('../models/Country');

// Add a new country
exports.addCountry = async (req, res) => {
  try {
    const { name, lat, long } = req.body;
    const country = new Country({ name, lat, long, cities: [] });
    await country.save();
    res.status(201).json({ data: country });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all countries (with cities)
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json({ data: countries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a country
exports.updateCountry = async (req, res) => {
  try {
    const { name, lat, long } = req.body;
    const country = await Country.findByIdAndUpdate(
      req.params.id,
      { name, lat, long },
      { new: true }
    );
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json({ data: country });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a country
exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json({ message: 'Country deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add a city to a country
exports.addCity = async (req, res) => {
  try {
    const { name, lat, long } = req.body;
    const country = await Country.findById(req.params.countryId);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    country.cities.push({ name, lat, long });
    await country.save();
    res.status(201).json({ data: country });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a city in a country
exports.updateCity = async (req, res) => {
  try {
    const { name, lat, long } = req.body;
    const country = await Country.findById(req.params.countryId);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    const city = country.cities.id(req.params.cityId);
    if (!city) return res.status(404).json({ error: 'City not found' });
    city.name = name;
    city.lat = lat;
    city.long = long;
    await country.save();
    res.json({ data: country });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a city from a country
exports.deleteCity = async (req, res) => {
  try {
    const country = await Country.findById(req.params.countryId);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    const originalLength = country.cities.length;
    country.cities = country.cities.filter(
      c => c._id.toString() !== req.params.cityId
    );

    if (country.cities.length === originalLength) {
      return res.status(404).json({ error: 'City not found' });
    }

    await country.save();
    res.json({ data: country });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Dropdown API: get all countries and their cities (for dropdowns)
exports.getDropdown = async (req, res) => {
  try {
    const countries = await Country.find({}, 'name cities');
    res.json({ data: countries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 