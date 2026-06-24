import mongoose, { Schema } from 'mongoose';
import User from './User.js';

const DoctorSchema = new Schema({
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  registration_number: { type: String, required: true },
  consultation_fee: { type: Number, required: true },
  available_timings: [{
    day: { type: String },
    start: { type: String },
    end: { type: String }
  }]
});

export default User.discriminator('Doctor', DoctorSchema);
