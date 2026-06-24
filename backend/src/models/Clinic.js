import mongoose, { Schema } from 'mongoose';

const ClinicSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Active', 'Suspended', 'Expired'], 
      default: 'Active' 
    },
    subscriptionPlan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan'
    },
    subscriptionExpiry: { type: Date },
    customFeatures: [{ type: Schema.Types.ObjectId, ref: 'Feature' }]
  },
  { timestamps: true }
);

export default mongoose.model('Clinic', ClinicSchema);
