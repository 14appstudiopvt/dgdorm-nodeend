// src/controllers/locationController.js

exports.searchLocations = (req, res) => {
  const query = req.query.query;
  // TODO: Implement your search logic here
  res.json({ success: true, message: `You searched for: ${query}` });
}; 