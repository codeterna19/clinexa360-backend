import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Doctor from './src/models/Doctor.js';

dotenv.config();

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clinexa360');
    console.log('MongoDB Connected.');

    const emails = [
      'admin@clinexa360.com',
      'clinicadmin@citycare.com',
      'doctor@abcclinic.com',
      'reception@abcclinic.com',
      'nurse@abcclinic.com',
      'lab@abcclinic.com',
      'accountant@abcclinic.com'
    ];

    const users = await User.find({ email: { $in: emails } });
    
    for (const u of users) {
      u.password = 'password123';
      await u.save(); // This will trigger the pre-save hook and hash it correctly
      console.log(`Reset password for: ${u.email}`);
    }

    console.log('All passwords reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting passwords:', error);
    process.exit(1);
  }
};

fixPasswords();
