import express from 'express';
import { getPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('SuperAdmin'), getPlans)
  .post(protect, authorize('SuperAdmin'), createPlan);

router.route('/:id')
  .put(protect, authorize('SuperAdmin'), updatePlan)
  .delete(protect, authorize('SuperAdmin'), deletePlan);

export default router;
