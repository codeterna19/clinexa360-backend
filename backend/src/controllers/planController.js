import Plan from '../models/Plan.js';

// @desc    Get all plans
// @route   GET /api/plans
// @access  Private/SuperAdmin
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({}).populate('features');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new plan
// @route   POST /api/plans
// @access  Private/SuperAdmin
export const createPlan = async (req, res) => {
  const { name, price, features, isActive } = req.body;
  
  try {
    const planExists = await Plan.findOne({ name });
    if (planExists) {
      return res.status(400).json({ message: 'Plan already exists' });
    }

    const plan = await Plan.create({
      name,
      price,
      features,
      isActive
    });
    const populatedPlan = await plan.populate('features');
    res.status(201).json(populatedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a plan
// @route   PUT /api/plans/:id
// @access  Private/SuperAdmin
export const updatePlan = async (req, res) => {
  const { name, price, features, isActive } = req.body;

  try {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
      plan.name = name || plan.name;
      plan.price = price !== undefined ? price : plan.price;
      plan.features = features || plan.features;
      plan.isActive = isActive !== undefined ? isActive : plan.isActive;
      
      const updatedPlan = await plan.save();
      const populatedPlan = await updatedPlan.populate('features');
      res.json(populatedPlan);
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a plan
// @route   DELETE /api/plans/:id
// @access  Private/SuperAdmin
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (plan) {
      res.json({ message: 'Plan removed' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
