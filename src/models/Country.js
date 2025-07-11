const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  long: { type: Number, required: true }
});

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  lat: { type: Number }, // Optional: central point for country
  long: { type: Number },
  cities: [citySchema]
});

module.exports = mongoose.model('Country', countrySchema); 