const express = require('express');
const cors = require('cors');
require('dotenv').config();

const servicesRoutes = require('./routes/services');
const doctorsRoutes = require('./routes/doctors');
const appointmentsRoutes = require('./routes/appointments');

const authRoutes = require('./routes/auth');

const { pool } = require('./db');

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/services', servicesRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);

app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Backend is running!',
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Dental clinic backend is running.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});