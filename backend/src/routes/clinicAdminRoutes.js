import express from 'express';
import { getDoctors, addDoctor, updateDoctor, deleteDoctor, getStaff, addStaff, updateStaff, deleteStaff, getClinicSettings, updateClinicSettings } from '../controllers/clinicAdminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

// Apply auth, role check, and multi-tenant isolation to all routes in this module
router.use(protect);
router.use(authorize('ClinicAdmin'));
router.use(tenantMiddleware);

router.route('/doctors')
  .get(getDoctors)
  .post(addDoctor);

router.route('/doctors/:id')
  .put(updateDoctor)
  .delete(deleteDoctor);

router.route('/staff')
  .get(getStaff)
  .post(addStaff);

router.route('/staff/:id')
  .put(updateStaff)
  .delete(deleteStaff);

router.route('/settings')
  .get(getClinicSettings)
  .put(updateClinicSettings);

export default router;
