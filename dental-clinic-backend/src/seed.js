// seed.js
const { pool } = require('./db');

const seedData = async () => {
  try {
    console.log('Seeding initial data...');

    // 1. Insert Services
    await pool.query(`
      INSERT INTO services (name, description, price, duration_minutes) 
      VALUES 
        ('Teeth Cleaning', 'Routine dental cleaning and checkup.', 75.00, 45),
        ('Tooth Extraction', 'Safe removal of damaged or problematic teeth.', 150.00, 60),
        ('Root Canal', 'Comprehensive root canal treatment.', 350.00, 90),
        ('Teeth Whitening', 'Professional cosmetic whitening treatment.', 200.00, 60)
      ON CONFLICT DO NOTHING;
    `);

    // 2. Insert Doctors
    await pool.query(`
      INSERT INTO doctors (name, specialty, email, phone) 
      VALUES 
        ('Dr. Sarah Connor', 'General Dentist', 'sarah.connor@clinic.com', '+1234567890'),
        ('Dr. John Smith', 'Orthodontist', 'john.smith@clinic.com', '+1234567891'),
        ('Dr. Emily Stone', 'Endodontist', 'emily.stone@clinic.com', '+1234567892')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedData();