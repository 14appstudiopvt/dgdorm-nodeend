const User = require('../models/User');

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user by ID
exports.updateUserById = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true, select: '-password' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ data: user, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 