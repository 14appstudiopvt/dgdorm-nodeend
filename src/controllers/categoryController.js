const Category = require('../models/Category');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    let icon = req.body.icon;

    // Use Cloudinary URL if file uploaded
    if (req.file && req.file.path) {
      icon = req.file.path;
    }

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      icon,
      createdBy: req.user._id
    });

    res.status(201).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('createdBy', 'firstName lastName email role');
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Category By Name
exports.getCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ name }).populate('createdBy', 'firstName lastName email role');
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Category By ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    let icon = req.body.icon;

    if (req.file && req.file.path) {
      icon = req.file.path;
    }

    const updateData = { name, description };
    if (icon) updateData.icon = icon;

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Category By ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};