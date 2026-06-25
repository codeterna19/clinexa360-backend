import express from 'express';
import { getAppointments, createAppointment, updateAppointmentStatus, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(tenantMiddleware);
// Any logged in user belonging to the clinic can view and create appointments (permissions vary inside controller)
router.use(authorize('ClinicAdmin', 'Doctor', 'Receptionist', 'Patient'));

router.route('/')
  .get(getAppointments)
  .post(createAppointment);

router.route('/:id')
  .put(updateAppointment)
  .delete(deleteAppointment);

router.route('/:id/status')
  .put(updateAppointmentStatus);

export default router;
