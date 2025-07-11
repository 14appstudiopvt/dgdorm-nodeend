const Property = require('../models/Property');
const User = require('../models/User');

// --- Public Routes ---

// @desc    Get all approved properties with optional pagination
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find({ status: 'approved' })
      .populate('owner', 'firstName lastName email')
      .populate('category', 'name')
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments({ status: 'approved' });

    res.status(200).json({
      data: properties,
      count: properties.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get a single property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, status: 'approved' })
      .populate('owner', 'firstName lastName email')
      .populate('category', 'name');

    if (!property) {
      return res.status(404).json({ error: 'Property not found or not approved' });
    }

    res.status(200).json({ data: property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Filter and search properties
// @route   POST /api/properties/filter
// @access  Public
exports.filterProperties = async (req, res) => {
  try {
    const { query: textQuery, category, price, location, amenities } = req.body;
    let filter = { status: 'approved' };

    // Text search
    if (textQuery) {
      filter.$text = { $search: textQuery };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price filter
    if (price) {
      filter.price = {};
      if (price.min) filter.price.$gte = price.min;
      if (price.max) filter.price.$lte = price.max;
    }

    // Amenities filter
    if (amenities && amenities.length > 0) {
      filter.amenities = { $all: amenities };
    }

    // Geospatial filter
    if (location && location.lat && location.lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat],
          },
          $maxDistance: (location.radius || 10) * 1000, // radius in meters
        },
      };
    }

    const properties = await Property.find(filter)
      .populate('owner', 'firstName lastName email')
      .populate('category', 'name');

    res.status(200).json({ data: properties, count: properties.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// --- User Routes ---

// @desc    Add a property to user's favorites
// @route   POST /api/users/:id/favorites
// @access  Private (User)
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const propertyId = req.body.propertyId;
    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.favorites.includes(propertyId)) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }
    user.favorites.push(propertyId);
    await user.save();
    res.status(200).json({ message: 'Property added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get user's favorite properties
// @route   GET /api/users/:id/favorites
// @access  Private (User)
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({
      path: 'favorites',
      populate: [
        { path: 'owner', select: 'firstName lastName' },
        { path: 'category', select: 'name' }
      ]
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ data: user.favorites, count: user.favorites.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// --- Owner Routes ---

// @desc    Get all properties for a specific owner
// @route   GET /api/owner/properties
// @access  Private (Owner)
exports.getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const properties = await Property.find({ owner: ownerId })
      .populate('category', 'name');
    res.status(200).json({ data: properties, count: properties.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new property
// @route   POST /api/owner/properties
// @access  Private (Owner)
exports.createProperty = async (req, res) => {
  try {
    let { title, description, category, address, price, amenities, location } = req.body;
    // Parse amenities if sent as a string (from form-data)
    if (typeof amenities === 'string') {
      try {
        amenities = JSON.parse(amenities);
      } catch {
        amenities = [amenities];
      }
    }
    // Parse location if sent as a string (from form-data)
    if (typeof location === 'string') {
      try {
        location = JSON.parse(location);
      } catch {
        location = null;
      }
    }
    // Defensive: handle both [lng, lat] and [lat, lng] (if keys are present)
    let coordinates = null;
    if (location && Array.isArray(location.coordinates)) {
      coordinates = location.coordinates;
    } else if (location && location.lng !== undefined && location.lat !== undefined) {
      coordinates = [Number(location.lng), Number(location.lat)];
    }
    const images = req.files ? req.files.map(file => file.path) : [];
    if (!title || !description || !category || !address || !price || !coordinates) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const property = await Property.create({
      title,
      description,
      category,
      owner: req.user._id,
      address,
      price,
      images,
      amenities: amenities || [],
      location: {
        type: 'Point',
        coordinates: coordinates
      }
    });
    res.status(201).json({ data: property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/owner/properties/:id
// @access  Private (Owner)
exports.updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const {
      title,
      description,
      category,
      address,
      price,
      amenities,
      location,
      isAvailable
    } = req.body;
    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (category !== undefined) property.category = category;
    if (address !== undefined) property.address = address;
    if (price !== undefined) property.price = price;
    if (amenities !== undefined) property.amenities = amenities;
    if (location && location.lat && location.lng) {
      property.location = {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      };
    }
    if (isAvailable !== undefined) property.isAvailable = isAvailable;
    if (req.files && req.files.length > 0) {
      property.images = req.files.map(file => file.path);
    }
    await property.save();
    res.status(200).json({ data: property });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/owner/properties/:id
// @access  Private (Owner)
exports.deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await property.deleteOne();
    res.status(200).json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// --- Admin Routes ---

// @desc    Get properties by status (e.g., pending)
// @route   GET /api/admin/properties
// @access  Private (Admin)
exports.getPropertiesByStatus = async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const properties = await Property.find({ status })
      .populate('owner', 'firstName lastName email')
      .populate('category', 'name');
    res.status(200).json({ data: properties, count: properties.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Approve a property
// @route   POST /api/admin/properties/:id/approve
// @access  Private (Admin)
exports.approveProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    property.status = 'approved';
    await property.save();
    res.status(200).json({ data: property, message: 'Property approved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Reject a property
// @route   POST /api/admin/properties/:id/reject
// @access  Private (Admin)
exports.rejectProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    property.status = 'rejected';
    await property.save();
    res.status(200).json({ data: property, message: 'Property rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Ban an owner (set isBanned=true and disable their properties)
// @route   POST /api/admin/owners/:id/ban
// @access  Private (Admin)
exports.banOwner = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const owner = await User.findById(ownerId);
    if (!owner || owner.role !== 'owner') {
      return res.status(404).json({ error: 'Owner not found' });
    }
    owner.isBanned = true;
    await owner.save();
    // Set all their properties to unavailable
    await Property.updateMany({ owner: ownerId }, { isAvailable: false });
    res.status(200).json({ message: 'Owner banned and their properties disabled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- Extra Admin APIs ---

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ data: users, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all owners
// @route   GET /api/admin/owners
// @access  Private (Admin)
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('-password');
    res.status(200).json({ data: owners, count: owners.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all properties (admin)
// @route   GET /api/admin/all-properties
// @access  Private (Admin)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'firstName lastName email')
      .populate('category', 'name');
    res.status(200).json({ data: properties, count: properties.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 