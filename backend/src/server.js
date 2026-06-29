import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import clinicRoutes from './routes/clinicRoutes.js';
import clinicAdminRoutes from './routes/clinicAdminRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import billRoutes from './routes/billRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import featureRoutes from './routes/featureRoutes.js';
import planRoutes from './routes/planRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/clinic-admin', clinicAdminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/public', publicRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Clinexa360 API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
