import Bill from '../models/Bill.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all bills for the clinic
// @route   GET /api/bills
// @access  Private (ClinicAdmin, Receptionist, Accountant)
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ ...req.tenantFilter })
      .populate('patient_id', 'name email phone')
      .populate('doctor_id', 'name specialization')
      .populate({
        path: 'appointment_id',
        select: 'date time type doctor_id',
        populate: {
          path: 'doctor_id',
          select: 'name specialization'
        }
      });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new bill
// @route   POST /api/bills
// @access  Private (ClinicAdmin, Receptionist, Accountant)
export const createBill = async (req, res) => {
  const { patient_id, appointment_id, doctor_id, amount, payment_mode, status } = req.body;

  try {
    // Generate simple invoice number
    const invoice_number = `INV-${Date.now().toString().slice(-6)}`;

    const bill = await Bill.create({
      clinic_id: req.user.clinic_id,
      patient_id,
      appointment_id,
      doctor_id,
      amount,
      payment_mode,
      status: status || 'Pending',
      invoice_number
    });

    const populated = await Bill.findById(bill._id)
      .populate('patient_id', 'name email phone')
      .populate('doctor_id', 'name specialization')
      .populate({
        path: 'appointment_id',
        select: 'date time type doctor_id',
        populate: {
          path: 'doctor_id',
          select: 'name specialization'
        }
      });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bill status (e.g. mark as Paid)
// @route   PUT /api/bills/:id/status
// @access  Private (ClinicAdmin, Receptionist, Accountant)
export const updateBillStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const bill = await Bill.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    bill.status = status;
    const updatedBill = await bill.save();
    
    res.json(updatedBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a bill
// @route   PUT /api/bills/:id
// @access  Private (ClinicAdmin, Receptionist, Accountant)
export const updateBill = async (req, res) => {
  const { patient_id, appointment_id, doctor_id, amount, payment_mode, status } = req.body;

  try {
    const bill = await Bill.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (patient_id) bill.patient_id = patient_id;
    if (appointment_id !== undefined) bill.appointment_id = appointment_id;
    if (doctor_id !== undefined) bill.doctor_id = doctor_id;
    if (amount !== undefined) bill.amount = amount;
    if (payment_mode) bill.payment_mode = payment_mode;
    if (status) bill.status = status;

    const updatedBill = await bill.save();

    const populated = await Bill.findById(updatedBill._id)
      .populate('patient_id', 'name email phone')
      .populate('doctor_id', 'name specialization')
      .populate({
        path: 'appointment_id',
        select: 'date time type doctor_id',
        populate: {
          path: 'doctor_id',
          select: 'name specialization'
        }
      });

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bill
// @route   DELETE /api/bills/:id
// @access  Private (ClinicAdmin, Receptionist, Accountant)
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, ...req.tenantFilter });

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    await bill.deleteOne();
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
