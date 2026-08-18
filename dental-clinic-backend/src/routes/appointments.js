// routes/appointments.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const verifyAdminToken = require('../middleware/auth');

// Function to generate a random 6-character alphanumeric code (e.g., A8K2P9)
const generateLookupCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 1. PUBLIC: Create Appointment (Updated to include lookup code)
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

    const lookup_code = generateLookupCode();

    const newAppointment = await pool.query(
      `INSERT INTO appointments (doctor_id, service_id, client_name, client_email, client_phone, appointment_date, appointment_time, lookup_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [doctor_id, service_id, client_name, client_email, client_phone, appointment_date, appointment_time, lookup_code]
    );

    res.status(201).json({ 
      message: 'Appointment submitted successfully!', 
      appointment: newAppointment.rows[0],
      lookup_code: lookup_code
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Server error creating appointment' });
  }
});

// 2. PUBLIC: Search/View Appointment by Lookup Code & Email
router.get('/lookup', async (req, res) => {
  const { code, email } = req.query;

  if (!code || !email) {
    return res.status(400).json({ error: 'Please provide both booking code and email.' });
  }

  try {
    const query = `
      SELECT 
        a.id, a.client_name, a.client_email, a.client_phone, 
        a.appointment_date, a.appointment_time, a.status, a.lookup_code,
        d.name AS doctor_name, d.specialty AS doctor_specialty,
        s.name AS service_name, s.price AS service_price
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE UPPER(a.lookup_code) = UPPER($1) AND LOWER(a.client_email) = LOWER($2)
    `;

    const { rows } = await pool.query(query, [code.trim(), email.trim()]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No matching appointment found. Check your code and email.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error looking up appointment:', error);
    res.status(500).json({ error: 'Server error looking up appointment' });
  }
});

// 3. PUBLIC: Client Cancels Their Appointment
router.patch('/cancel-by-client', async (req, res) => {
  const { code, email } = req.body;

  if (!code || !email) {
    return res.status(400).json({ error: 'Booking code and email are required.' });
  }

  try {
    const updated = await pool.query(
      `UPDATE appointments 
       SET status = 'cancelled' 
       WHERE UPPER(lookup_code) = UPPER($1) AND LOWER(client_email) = LOWER($2) AND status != 'cancelled'
       RETURNING *`,
      [code.trim(), email.trim()]
    );

    if (updated.rows.length === 0) {
      return res.status(400).json({ error: 'Unable to cancel. Appointment not found or already cancelled.' });
    }

    res.json({ message: 'Your appointment has been successfully cancelled.', appointment: updated.rows[0] });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Server error cancelling appointment' });
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

// GET /api/appointments/booked-slots?doctor_id=...&date=YYYY-MM-DD
router.get('/booked-slots', async (req, res) => {
  const { doctor_id, date } = req.query;

  if (!doctor_id || !date) {
    return res.status(400).json({ error: 'doctor_id and date query params are required' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT appointment_time FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND status != 'cancelled'`,
      [doctor_id, date]
    );

    // Extract time strings into an array
    const bookedTimes = rows.map((r) => r.appointment_time);
    res.json(bookedTimes);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Server error fetching slot availability' });
  }
});

module.exports = router;