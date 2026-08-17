// routes/appointments.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const verifyAdminToken = require('../middleware/auth');

// PUBLIC: Client submits an appointment (NO TOKEN REQUIRED)
router.post('/', async (req, res) => {
  const { doctor_id, service_id, client_name, client_email, client_phone, appointment_date, appointment_time } = req.body;

  try {
    const existingBooking = await pool.query(
      `SELECT * FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 AND status != 'cancelled'`,
      [doctor_id, appointment_date, appointment_time]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({ error: 'This time slot is already booked for the selected doctor.' });
    }

    const newAppointment = await pool.query(
      `INSERT INTO appointments (doctor_id, service_id, client_name, client_email, client_phone, appointment_date, appointment_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [doctor_id, service_id, client_name, client_email, client_phone, appointment_date, appointment_time]
    );

    res.status(201).json({ message: 'Appointment submitted successfully!', appointment: newAppointment.rows[0] });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Server error creating appointment' });
  }
});

// PROTECTED: Admin views all appointments
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id, a.client_name, a.client_email, a.client_phone, 
        a.appointment_date, a.appointment_time, a.status,
        d.name AS doctor_name,
        s.name AS service_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN services s ON a.service_id = s.id
      ORDER BY a.appointment_date DESC, a.appointment_time ASC
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Server error fetching appointments' });
  }
});

// PROTECTED: Admin updates appointment status (approve/reject/cancel)
router.patch('/:id/status', verifyAdminToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status update' });
  }

  try {
    const updated = await pool.query(
      `UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: `Appointment status updated to ${status}`, appointment: updated.rows[0] });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Server error updating appointment' });
  }
});

module.exports = router;