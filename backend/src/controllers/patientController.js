import Patient from '../models/Patient.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Bill from '../models/Bill.js';

// @desc    Get all patients for the clinic
// @route   GET /api/patients
// @access  Private (ClinicAdmin, Doctor, Receptionist)
export const getPatients = async (req, res) => {
  try {
    // Find all appointments for this clinic
    const clinicAppointments = await Appointment.find({ ...req.tenantFilter }).select('patient_id');
    const appointmentPatientIds = clinicAppointments.map(a => a.patient_id);

    // Find patients that either belong to this clinic directly OR have an appointment here
    // We use User.find() instead of Patient.find() to also catch legacy mobile-app users 
    // that were created without the Patient discriminator key before the fix.
    const patients = await User.find({
      $or: [
        { ...req.tenantFilter },
        { _id: { $in: appointmentPatientIds } }
      ],
      role: 'Patient'
    });
    
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Private (ClinicAdmin, Receptionist)
export const registerPatient = async (req, res) => {
  const { name, email, phone, password, gender, dob, blood_group, emergency_contact, allergies, medical_history } = req.body;

  try {
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return res.status(400).json({ message: 'Patient with this email already exists' });
    }

    const patient = await Patient.create({
      clinic_id: req.user.clinic_id,
      name,
      email,
      phone,
      password,
      role: 'Patient',
      status: 'Active',
      gender,
      dob,
      blood_group,
      emergency_contact,
      allergies,
      medical_history
    });

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private (ClinicAdmin, Doctor, Receptionist)
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (patient) {
      Object.assign(patient, req.body);
      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private (ClinicAdmin, Receptionist)
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.deleteOne();
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient's own appointments
// @route   GET /api/patients/my-appointments
// @access  Private (Patient)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient_id: req.user._id })
      .populate('doctor_id', 'name specialization')
      .populate('clinic_id', 'name address')
      .sort({ date: 1, time: 1 });
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient's own bills
// @route   GET /api/patients/my-bills
// @access  Private (Patient)
export const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ patient_id: req.user._id })
      .populate('appointment_id', 'date time doctor_id clinic_id')
      .sort({ createdAt: -1 });
      
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book an appointment (Patient initiated)
// @route   POST /api/patients/book-appointment
// @access  Private (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctor_id, clinic_id, date, time, reason } = req.body;
    
    // Quick validation
    if (!doctor_id || !clinic_id || !date || !time) {
      return res.status(400).json({ message: 'Missing required appointment fields' });
    }

    const appointment = await Appointment.create({
      patient_id: req.user._id,
      doctor_id,
      clinic_id,
      date,
      time,
      description: reason,
      status: 'Pending'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
