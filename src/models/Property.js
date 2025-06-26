const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  address: {
    type: String,
    required: [true, 'Property address is required'],
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
  },
  images: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Index for geospatial queries
PropertySchema.index({ location: '2dsphere' });
// Index for text search
PropertySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Property', PropertySchema); 