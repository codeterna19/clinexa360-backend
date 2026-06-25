import mongoose, { Schema } from 'mongoose';

const AppointmentSchema = new Schema(
  {
    clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
    branch_id: { type: Schema.Types.ObjectId, ref: 'Branch' },
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ['Consultation', 'Follow-up', 'Telemedicine'], default: 'Consultation' },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No Show'], default: 'Pending' },
    description: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', AppointmentSchema);
