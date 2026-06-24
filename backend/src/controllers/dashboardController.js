import Clinic from '../models/Clinic.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Bill from '../models/Bill.js';

// @desc    Get Super Admin Dashboard Stats
// @route   GET /api/dashboard/superadmin
// @access  Private/SuperAdmin
export const getSuperAdminStats = async (req, res) => {
  try {
    const totalClinics = await Clinic.countDocuments();
    const totalDoctors = await User.countDocuments({ role: 'Doctor' });
    const activePatients = await Patient.countDocuments();
    const monthlyRevenue = 15200; // Mocked for now, need logic to aggregate across all clinics

    res.json({
      totalClinics,
      totalDoctors,
      activePatients,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// @desc    Get Clinic Admin Dashboard Stats
// @route   GET /api/dashboard/clinicadmin
// @access  Private (ClinicAdmin, Receptionist, Doctor)
export const getClinicAdminStats = async (req, res) => {
  try {
    const clinicId = req.user.clinic_id;

    // Start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysAppointments = await Appointment.countDocuments({
      clinic_id: clinicId,
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    const activeDoctors = await User.countDocuments({
      clinic_id: clinicId,
      role: 'Doctor'
    });

    const pendingFollowUps = 5; // Mocked for now

    const patientsTreated = await Patient.countDocuments({
      clinic_id: clinicId
    });

    res.json({
      todaysAppointments,
      activeDoctors,
      pendingFollowUps,
      patientsTreated
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};
