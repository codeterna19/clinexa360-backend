import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Clinic from './models/Clinic.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Clinic.deleteMany();

    console.log('Data Cleared!');

    // Create Super Admin
    const superAdmin = await User.create({
      name: 'Super Administrator',
      email: 'admin@clinexa360.com',
      password: 'password123',
      phone: '1234567890',
      role: 'SuperAdmin',
      status: 'Active'
    });

    // Create a Sample Clinic
    const clinic = await Clinic.create({
      name: 'City Care Clinic',
      address: '123 Health Ave, Medical District',
      phone: '0987654321',
      email: 'contact@citycare.com',
      status: 'Active'
    });

    // Create Clinic Admin
    const clinicAdmin = await User.create({
      name: 'Clinic Administrator',
      email: 'clinicadmin@citycare.com',
      password: 'password123',
      phone: '0987654321',
      role: 'ClinicAdmin',
      clinic_id: clinic._id,
      status: 'Active'
    });

    console.log('Data Imported successfully!');
    console.log('--- TEST ACCOUNTS ---');
    console.log(`SuperAdmin: ${superAdmin.email} / password123`);
    console.log(`ClinicAdmin: ${clinicAdmin.email} / password123`);
    process.exit();
  } catch (error) {
    console.error(`Error with seeder: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // Not implemented yet
} else {
  importData();
}
