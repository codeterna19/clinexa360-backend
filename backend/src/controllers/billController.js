import Bill from '../models/Bill.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all bills for the clinic
// @route   GET /api/bills
// @access  Private (ClinicAdmin, Receptionist, Accountant)
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ ...req.tenantFilter })
      .populate('patient_id', 'name email phone')
      .populate('appointment_id', 'date time type');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new bill
// @route   POST /api/bills
// @access  Private (ClinicAdmin, Receptionist, Accountant)
export const createBill = async (req, res) => {
  const { patient_id, appointment_id, amount, payment_mode } = req.body;

  try {
    // Generate simple invoice number
    const invoice_number = `INV-${Date.now().toString().slice(-6)}`;

    const bill = await Bill.create({
      clinic_id: req.user.clinic_id,
      patient_id,
      appointment_id,
      amount,
      payment_mode,
      status: 'Pending',
      invoice_number
    });

    res.status(201).json(bill);
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
