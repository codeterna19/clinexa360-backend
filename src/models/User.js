import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', default: null },
    branch_id: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['SuperAdmin', 'ClinicAdmin', 'Doctor', 'Receptionist', 'Patient', 'Nurse', 'LabTechnician', 'Accountant'], 
      required: true 
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    available_timings: [{
      days: [{ type: String }],
      start: { type: String },
      end: { type: String }
    }]
  },
  { timestamps: true, discriminatorKey: 'role' }
);

import bcrypt from 'bcryptjs';

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', UserSchema);

// Register empty discriminators for roles without extra fields
User.discriminator('SuperAdmin', new Schema({}));
User.discriminator('ClinicAdmin', new Schema({}));
User.discriminator('Receptionist', new Schema({}));
User.discriminator('Nurse', new Schema({}));
User.discriminator('LabTechnician', new Schema({}));
User.discriminator('Accountant', new Schema({}));

export default User;
