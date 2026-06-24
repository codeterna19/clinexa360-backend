import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Clinic from '../models/Clinic.js';

// @desc    Get all doctors for a specific clinic
// @route   GET /api/clinic-admin/doctors
// @access  Private/ClinicAdmin
export const getDoctors = async (req, res) => {
  try {
    // req.tenantFilter is { clinic_id: req.user.clinic_id } populated by tenantMiddleware
    const doctors = await Doctor.find({ ...req.tenantFilter, role: 'Doctor' });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new doctor to the clinic
// @route   POST /api/clinic-admin/doctors
// @access  Private/ClinicAdmin
export const addDoctor = async (req, res) => {
  const { name, email, phone, password, qualification, specialization, registration_number, consultation_fee, available_timings } = req.body;

  try {
    const doctorExists = await User.findOne({ email });
    if (doctorExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const doctor = await Doctor.create({
      clinic_id: req.user.clinic_id,
      name,
      email,
      phone,
      password,
      role: 'Doctor',
      status: 'Active',
      qualification,
      specialization,
      registration_number,
      consultation_fee,
      available_timings
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a doctor's details
// @route   PUT /api/clinic-admin/doctors/:id
// @access  Private/ClinicAdmin
export const updateDoctor = async (req, res) => {
  const { name, email, phone, password, qualification, specialization, registration_number, consultation_fee, status, available_timings } = req.body;

  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (name) doctor.name = name;
    if (email) doctor.email = email;
    if (phone) doctor.phone = phone;
    if (password) doctor.password = password;
    if (qualification) doctor.qualification = qualification;
    if (specialization) doctor.specialization = specialization;
    if (registration_number) doctor.registration_number = registration_number;
    if (consultation_fee) doctor.consultation_fee = consultation_fee;
    if (status) doctor.status = status;
    if (available_timings) doctor.available_timings = available_timings;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/clinic-admin/doctors/:id
// @access  Private/ClinicAdmin
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.deleteOne();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff (Receptionists, Nurses, etc) for a clinic
// @route   GET /api/clinic-admin/staff
// @access  Private/ClinicAdmin
export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ 
      ...req.tenantFilter, 
      role: { $in: ['Receptionist', 'Nurse', 'LabTechnician', 'Accountant'] } 
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new staff to the clinic
// @route   POST /api/clinic-admin/staff
// @access  Private/ClinicAdmin
export const addStaff = async (req, res) => {
  const { name, email, phone, password, role, available_timings } = req.body;

  try {
    if (!['Receptionist', 'Nurse', 'LabTechnician', 'Accountant'].includes(role)) {
      return res.status(400).json({ message: 'Invalid staff role specified' });
    }

    const staffExists = await User.findOne({ email });
    if (staffExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const staff = await User.create({
      clinic_id: req.user.clinic_id,
      name,
      email,
      phone,
      password,
      role,
      status: 'Active',
      available_timings
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update staff details
// @route   PUT /api/clinic-admin/staff/:id
// @access  Private/ClinicAdmin
export const updateStaff = async (req, res) => {
  const { name, phone, email, password, role, status, available_timings } = req.body;

  try {
    const staff = await User.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    if (name) staff.name = name;
    if (phone) staff.phone = phone;
    if (email) staff.email = email;
    if (password) staff.password = password; // pre-save hook will hash it
    if (role) staff.role = role;
    if (status) staff.status = status;
    if (available_timings) staff.available_timings = available_timings;

    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/clinic-admin/staff/:id
// @access  Private/ClinicAdmin
export const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.deleteOne();
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Clinic Settings
// @route   GET /api/clinic-admin/settings
// @access  Private/ClinicAdmin
export const getClinicSettings = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.user.clinic_id);
    if (clinic) {
      res.json(clinic);
    } else {
      res.status(404).json({ message: 'Clinic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Clinic Settings
// @route   PUT /api/clinic-admin/settings
// @access  Private/ClinicAdmin
export const updateClinicSettings = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const clinic = await Clinic.findById(req.user.clinic_id);
    if (clinic) {
      clinic.name = name || clinic.name;
      clinic.email = email || clinic.email;
      clinic.phone = phone || clinic.phone;
      clinic.address = address || clinic.address;
      
      const updatedClinic = await clinic.save();
      res.json(updatedClinic);
    } else {
      res.status(404).json({ message: 'Clinic not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
