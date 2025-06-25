const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);