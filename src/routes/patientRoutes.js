import express from 'express';
import { getPatients, registerPatient, updatePatient } from '../controllers/patientController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(tenantMiddleware);
// Doctors, Clinic Admins, and Receptionists can access
router.use(authorize('ClinicAdmin', 'Doctor', 'Receptionist'));

router.route('/')
  .get(getPatients)
  .post(registerPatient);

router.route('/:id')
  .put(updatePatient);

export default router;
