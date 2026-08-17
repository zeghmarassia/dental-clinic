const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/services - Fetch all services
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Server error fetching services' });
  }
});

module.exports = router;