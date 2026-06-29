import express from 'express';
import { getPublicClinics, getPublicDoctors } from '../controllers/publicController.js';

const router = express.Router();

router.get('/clinics', getPublicClinics);
router.get('/doctors', getPublicDoctors);

export default router;
