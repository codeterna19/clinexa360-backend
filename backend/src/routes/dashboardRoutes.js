import express from 'express';
import { getSuperAdminStats, getClinicAdminStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.get('/superadmin', protect, authorize('SuperAdmin'), getSuperAdminStats);
router.get('/clinicadmin', protect, authorize('ClinicAdmin', 'Receptionist', 'Doctor'), tenantMiddleware, getClinicAdminStats);

export default router;
