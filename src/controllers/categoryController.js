const Category = require('../models/Category');

// Create
exports.createCategory = async (req, res) => {
    try {
        // Debug logs (optional, remove in production)
        console.log('DEBUG createCategory: req.user:', req.user);
        console.log('DEBUG createCategory: req.body:', req.body);
        console.log('DEBUG createCategory: req.file:', req.file);

        // Ensure user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const { name, description } = req.body;
        const icon = req.file ? req.file.path : req.body.icon;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }
        const category = await Category.create({
            name,
            description,
            icon,
            createdBy: req.user._id
        });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error('ERROR in createCategory:', error);
        res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
    }
};

// Read all
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// read using sepcifc name
exports.getCategoriesByName = async (req, res) => {
    try {
        const categories = await Category.find().populate('createdBy', 'firstName lastName email role');
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );
        if (!category) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};