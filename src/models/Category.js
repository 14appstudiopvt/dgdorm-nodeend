const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String, // Store a URL or icon name
    default: ''
  },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // <-- Add this line

}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);