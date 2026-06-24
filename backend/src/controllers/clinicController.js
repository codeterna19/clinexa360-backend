import Clinic from '../models/Clinic.js';
import User from '../models/User.js';

// @desc    Get all clinics (SuperAdmin only)
// @route   GET /api/clinics
// @access  Private/SuperAdmin
export const getClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({})
      .populate('subscriptionPlan')
      .populate('customFeatures');
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Onboard a new clinic and its ClinicAdmin
// @route   POST /api/clinics
// @access  Private/SuperAdmin
export const createClinic = async (req, res) => {
  const {
    name, address, phone, email, logo_url,
    adminName, adminEmail, adminPhone, adminPassword,
    subscriptionPlan
  } = req.body;

  try {
    const clinicExists = await Clinic.findOne({ email });

    if (clinicExists) {
      return res.status(400).json({ message: 'Clinic already exists' });
    }

    const subscriptionExpiry = subscriptionPlan ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : undefined;

    // Create the clinic
    const clinic = await Clinic.create({
      name,
      email,
      phone,
      address,
      status: 'Active',
      subscriptionPlan: subscriptionPlan || undefined,
      subscriptionExpiry
    });

    // Create the clinic admin
    const clinicAdmin = await User.create({
      clinic_id: clinic._id,
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: adminPassword,
      role: 'ClinicAdmin',
      status: 'Active'
    });

    res.status(201).json({
      clinic,
      admin: clinicAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update basic clinic details
// @route   PUT /api/clinics/:id
// @access  Private/SuperAdmin
export const updateClinic = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const clinic = await Clinic.findById(req.params.id);

    if (clinic) {
      if (name) clinic.name = name;
      if (email) clinic.email = email;
      if (phone) clinic.phone = phone;
      if (address) clinic.address = address;

      const updatedClinic = await clinic.save();
      res.json(updatedClinic);
    } else {
      res.status(404).json({ message: 'Clinic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update clinic status (Suspend/Activate)
// @route   PUT /api/clinics/:id/status
// @access  Private/SuperAdmin
export const updateClinicStatus = async (req, res) => {
  const { status } = req.body; // 'Active' | 'Suspended' | 'Expired'

  try {
    const clinic = await Clinic.findById(req.params.id);

    if (clinic) {
      clinic.status = status;
      const updatedClinic = await clinic.save();
      res.json(updatedClinic);
    } else {
      res.status(404).json({ message: 'Clinic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update clinic subscription plan
// @route   PUT /api/clinics/:id/subscription
// @access  Private/SuperAdmin
export const updateClinicSubscription = async (req, res) => {
  const { subscriptionPlan, subscriptionExpiry, customFeatures } = req.body;

  try {
    const clinic = await Clinic.findById(req.params.id);

    if (clinic) {
      if (subscriptionPlan) clinic.subscriptionPlan = subscriptionPlan;
      if (subscriptionExpiry) clinic.subscriptionExpiry = subscriptionExpiry;
      if (customFeatures) {
        clinic.customFeatures = customFeatures;
      }
      
      const updatedClinic = await clinic.save();
      const populatedClinic = await updatedClinic
        .populate('subscriptionPlan')
        .then(doc => doc.populate('customFeatures'));
      res.json(populatedClinic);
    } else {
      res.status(404).json({ message: 'Clinic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a clinic and its users
// @route   DELETE /api/clinics/:id
// @access  Private/SuperAdmin
export const deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    // Delete all users associated with this clinic
    await User.deleteMany({ clinic_id: clinic._id });
    
    // Delete the clinic
    await clinic.deleteOne();
    
    res.json({ message: 'Clinic and associated users deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Clinic Admin Details
// @route   GET /api/clinics/:id/admin
// @access  Private/SuperAdmin
export const getClinicAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ clinic_id: req.params.id, role: 'ClinicAdmin' }).select('-password');
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Clinic Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Clinic Admin Details
// @route   PUT /api/clinics/:id/admin
// @access  Private/SuperAdmin
export const updateClinicAdmin = async (req, res) => {
  const { adminName, adminEmail, adminPhone, adminPassword } = req.body;

  try {
    const admin = await User.findOne({ clinic_id: req.params.id, role: 'ClinicAdmin' });

    if (admin) {
      if (adminName) admin.name = adminName;
      if (adminEmail) admin.email = adminEmail;
      if (adminPhone) admin.phone = adminPhone;
      if (adminPassword) admin.password = adminPassword; // Pre-save hook will hash it

      const updatedAdmin = await admin.save();
      res.json({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone
      });
    } else {
      res.status(404).json({ message: 'Clinic Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
