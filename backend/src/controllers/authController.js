import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinic_id: user.clinic_id,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new SuperAdmin (Initial Setup only)
// @route   POST /api/auth/register-superadmin
// @access  Public
export const registerSuperAdmin = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'SuperAdmin',
      status: 'Active'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new Patient (Public Mobile App)
// @route   POST /api/auth/register-patient
// @access  Public
export const registerPatientAuth = async (req, res) => {
  const { name, email, password, phone, dob, gender } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const patient = await Patient.create({
      name,
      email,
      password,
      phone,
      dob,
      gender,
      role: 'Patient',
      status: 'Active'
    });

    if (patient) {
      res.status(201).json({
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        token: generateToken(patient._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid patient data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
