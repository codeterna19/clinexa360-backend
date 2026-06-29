import Clinic from '../models/Clinic.js';
import User from '../models/User.js';

// @desc    Get all active clinics
// @route   GET /api/public/clinics
// @access  Public
export const getPublicClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({ status: 'Active' }).select('-__v');
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active doctors
// @route   GET /api/public/doctors
// @access  Public
export const getPublicDoctors = async (req, res) => {
  try {
    const filter = { role: 'Doctor', status: 'Active' };
    if (req.query.clinic_id) {
      filter.clinic_id = req.query.clinic_id;
    }
    
    const doctors = await User.find(filter)
      .select('name email phone specialization clinic_id available_timings')
      .populate('clinic_id', 'name address');
      
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
