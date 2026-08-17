const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/doctors - Fetch all doctors
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, specialty, email, phone FROM doctors ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Server error fetching doctors' });
  }
});

module.exports = router;