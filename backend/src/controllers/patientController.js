import Patient from '../models/Patient.js';

// @desc    Get all patients for the clinic
// @route   GET /api/patients
// @access  Private (ClinicAdmin, Doctor, Receptionist)
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ ...req.tenantFilter, role: 'Patient' });
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
