import Feature from '../models/Feature.js';

// @desc    Get all features
// @route   GET /api/features
// @access  Private/SuperAdmin
export const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find({});
    res.json(features);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new feature
// @route   POST /api/features
// @access  Private/SuperAdmin
export const createFeature = async (req, res) => {
  const { name, description, price, isActive } = req.body;
  
  try {
    const featureExists = await Feature.findOne({ name });
    if (featureExists) {
      return res.status(400).json({ message: 'Feature already exists' });
    }

    const feature = await Feature.create({
      name,
      description,
      price,
      isActive
    });
    res.status(201).json(feature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a feature
// @route   PUT /api/features/:id
// @access  Private/SuperAdmin
export const updateFeature = async (req, res) => {
  const { name, description, price, isActive } = req.body;

  try {
    const feature = await Feature.findById(req.params.id);

    if (feature) {
      feature.name = name || feature.name;
      feature.description = description !== undefined ? description : feature.description;
      feature.price = price !== undefined ? price : feature.price;
      feature.isActive = isActive !== undefined ? isActive : feature.isActive;
      
      const updatedFeature = await feature.save();
      res.json(updatedFeature);
    } else {
      res.status(404).json({ message: 'Feature not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a feature
// @route   DELETE /api/features/:id
// @access  Private/SuperAdmin
export const deleteFeature = async (req, res) => {
  try {
    const feature = await Feature.findByIdAndDelete(req.params.id);
    if (feature) {
      res.json({ message: 'Feature removed' });
    } else {
      res.status(404).json({ message: 'Feature not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
