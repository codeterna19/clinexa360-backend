import express from 'express';
import { authUser, registerSuperAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register-superadmin', registerSuperAdmin);

export default router;
