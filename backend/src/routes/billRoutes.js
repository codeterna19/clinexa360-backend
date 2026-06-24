import express from 'express';
import { getBills, createBill, updateBillStatus } from '../controllers/billController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { tenantMiddleware } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(tenantMiddleware);
router.use(authorize('ClinicAdmin', 'Receptionist', 'Accountant'));

router.route('/')
  .get(getBills)
  .post(createBill);

router.route('/:id/status')
  .put(updateBillStatus);

export default router;
