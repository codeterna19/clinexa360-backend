import mongoose, { Schema } from 'mongoose';

const BillSchema = new Schema(
  {
    clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
    branch_id: { type: Schema.Types.ObjectId, ref: 'Branch' },
    patient_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointment_id: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    doctor_id: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    payment_mode: { type: String, enum: ['Cash', 'UPI', 'Card', 'Net Banking'], required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    invoice_number: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model('Bill', BillSchema);
