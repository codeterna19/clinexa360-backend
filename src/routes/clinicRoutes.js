import express from 'express';
import { getClinics, createClinic, updateClinicStatus, updateClinicSubscription, updateClinic, deleteClinic, getClinicAdmin, updateClinicAdmin } from '../controllers/clinicController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('SuperAdmin'), getClinics)
  .post(protect, authorize('SuperAdmin'), createClinic);

router.route('/:id')
  .put(protect, authorize('SuperAdmin'), updateClinic)
  .delete(protect, authorize('SuperAdmin'), deleteClinic);

router.route('/:id/admin')
  .get(protect, authorize('SuperAdmin'), getClinicAdmin)
  .put(protect, authorize('SuperAdmin'), updateClinicAdmin);

router.route('/:id/status')
  .put(protect, authorize('SuperAdmin'), updateClinicStatus);

router.route('/:id/subscription')
  .put(protect, authorize('SuperAdmin'), updateClinicSubscription);

export default router;
