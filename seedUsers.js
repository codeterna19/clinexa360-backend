import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Clinic from './src/models/Clinic.js';
import Doctor from './src/models/Doctor.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clinexa360');
    console.log('MongoDB Connected.');

    // Create a dummy clinic
    let clinic = await Clinic.findOne({ email: 'info@abcclinic.com' });
    if (!clinic) {
      clinic = await Clinic.create({
        name: 'ABC Demo Clinic',
        email: 'info@abcclinic.com',
        phone: '1234567890',
        address: '123 Health St',
        status: 'Active'
      });
      console.log('Created demo clinic');
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const usersToSeed = [
      {
        name: 'Super Admin',
        email: 'admin@clinexa360.com',
        password,
        phone: '1234567890',
        role: 'SuperAdmin',
        status: 'Active'
      },
      {
        name: 'Clinic Admin',
        email: 'clinicadmin@citycare.com',
        password,
        phone: '1234567890',
        role: 'ClinicAdmin',
        clinic_id: clinic._id,
        status: 'Active'
      },
      {
        name: 'Dr. Smith',
        email: 'doctor@abcclinic.com',
        password,
        phone: '1234567890',
        role: 'Doctor',
        clinic_id: clinic._id,
        status: 'Active',
        consultation_fee: 500,
        registration_number: 'REG12345',
        specialization: 'General Physician',
        qualification: 'MBBS, MD'
      },
      {
        name: 'Jane Reception',
        email: 'reception@abcclinic.com',
        password,
        phone: '1234567890',
        role: 'Receptionist',
        clinic_id: clinic._id,
        status: 'Active'
      },
      {
        name: 'Nurse Joy',
        email: 'nurse@abcclinic.com',
        password,
        phone: '1234567890',
        role: 'Nurse',
        clinic_id: clinic._id,
        status: 'Active'
      },
      {
        name: 'Lab Tech',
        email: 'lab@abcclinic.com',
        password,
        phone: '1234567890',
        role: 'LabTechnician', // Using LabTechnician as per User.js schema
        clinic_id: clinic._id,
        status: 'Active'
      },
      {
        name: 'John Accountant',
        email: 'accountant@abcclinic.com',
        password,
        phone: '1234567890',
        role: 'Accountant',
        clinic_id: clinic._id,
        status: 'Active'
      }
    ];

    for (const u of usersToSeed) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        // use User.create directly, bypassing pre-save hook for password hash to avoid double hashing,
        // or just set plain text since the pre-save hook will hash it!
        // Ah, our pre-save hook in User.js hashes the password!
        // Let's pass plain text password to trigger the hook properly.
        const userObj = { ...u, password: 'password123' };
        await User.create(userObj);
        console.log(`Created user: ${u.email}`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    console.log('Demo users seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
