import express from 'express';
import { getPatients, registerPatient, updatePatient, deletePatient, getMyAppointments, getMyBills, bookAppointment } from '../controllers/patientController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect);

// Self-serve routes for patients (Must not use tenantMiddleware to allow cross-clinic access)
router.get('/my-appointments', authorize('Patient'), getMyAppointments);
router.get('/my-bills', authorize('Patient'), getMyBills);
router.post('/book-appointment', authorize('Patient'), bookAppointment);

router.use(tenantMiddleware);
// Doctors, Clinic Admins, and Receptionists can access
router.use(authorize('ClinicAdmin', 'Doctor', 'Receptionist'));

router.route('/')
  .get(getPatients)
  .post(registerPatient);

router.route('/:id')
  .put(updatePatient)
  .delete(deletePatient);

export default router;
