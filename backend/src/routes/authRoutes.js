import express from 'express';
import { authUser, registerSuperAdmin, registerPatientAuth } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register-superadmin', registerSuperAdmin);
router.post('/register-patient', registerPatientAuth);

export default router;
