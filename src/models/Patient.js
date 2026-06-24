import mongoose, { Schema } from 'mongoose';
import User from './User.js';

const PatientSchema = new Schema({
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dob: { type: Date, required: true },
  blood_group: { type: String },
  emergency_contact: { type: String },
  allergies: [{ type: String }],
  medical_history: [{ type: String }]
});

export default User.discriminator('Patient', PatientSchema);
