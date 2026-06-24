import mongoose, { Schema } from 'mongoose';

const PlanSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true, default: 0 },
    features: [{ type: Schema.Types.ObjectId, ref: 'Feature' }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Plan', PlanSchema);
