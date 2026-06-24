import Appointment from '../models/Appointment.js';

// @desc    Get appointments for the clinic (with optional filters)
// @route   GET /api/appointments
// @access  Private (ClinicAdmin, Doctor, Receptionist, Patient)
export const getAppointments = async (req, res) => {
  try {
    // Basic multi-tenant filter
    const filter = { ...req.tenantFilter };

    // Role-specific filtering
    if (req.user.role === 'Patient') {
      filter.patient_id = req.user._id;
    } else if (req.user.role === 'Doctor') {
      filter.doctor_id = req.user._id;
    }

    // Optional query params
    if (req.query.date) filter.date = req.query.date;
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter)
      .populate('patient_id', 'name email phone')
      .populate('doctor_id', 'name specialization');
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (ClinicAdmin, Receptionist, Patient)
export const createAppointment = async (req, res) => {
  const { doctor_id, date, time, type } = req.body;
  
  // If a receptionist or admin is booking, they should pass patient_id
  // If a patient is booking, use their own _id
  const patient_id = req.user.role === 'Patient' ? req.user._id : req.body.patient_id;

  try {
    const appointment = await Appointment.create({
      clinic_id: req.user.clinic_id,
      patient_id,
      doctor_id,
      date,
      time,
      type: type || 'Consultation',
      status: 'Pending'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (ClinicAdmin, Doctor, Receptionist)
export const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Basic permission check (e.g. patients can't mark as 'Completed')
    if (req.user.role === 'Patient' && !['Cancelled'].includes(status)) {
      return res.status(403).json({ message: 'Patients can only cancel appointments' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
