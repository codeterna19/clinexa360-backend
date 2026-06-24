import express from 'express';
import { getFeatures, createFeature, updateFeature, deleteFeature } from '../controllers/featureController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('SuperAdmin'), getFeatures)
  .post(protect, authorize('SuperAdmin'), createFeature);

router.route('/:id')
  .put(protect, authorize('SuperAdmin'), updateFeature)
  .delete(protect, authorize('SuperAdmin'), deleteFeature);

export default router;
