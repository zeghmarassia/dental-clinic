# 🦷 Dental Clinic Booking System

A full-stack, commercially ready web application for managing dental clinic appointments. Built using **React**, **Tailwind CSS**, **Express.js**, and **PostgreSQL**, this system provides a seamless booking experience for patients and an intuitive management panel for administrators.

---

## ✨ Features

### 👤 Patient / Client Side
* **Service & Doctor Selection:** Browse available dental services and select specialist doctors.
* **Interactive Slot Picker:** Choose convenient dates and time slots with automatic double-booking prevention.
* **Instant Booking Code:** Receive a unique 6-character booking code (e.g., `X7B9K2`) upon submission.
* **Appointment Lookup & Cancellation:** Search existing appointments using a booking code + email, and cancel bookings if needed.

### 🔐 Admin Side
* **Secure Authentication:** Protected admin panel powered by JWT (JSON Web Tokens) and `bcrypt` password hashing.
* **Appointment Management:** Real-time dashboard to view all appointments, filter details, and update statuses (**Approve**, **Reject**, or **Cancel**).

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide React
* **Backend:** Node.js, Express.js, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
* **Database:** PostgreSQL (Neon Serverless PostgreSQL)
* **Deployment:** 
  * Frontend: **Vercel**
  * Backend: **Render**
  * Database: **Neon**

---

## 🗄️ Database Schema Overview

The database consists of four relational tables:
* `services` – Stores service details, duration, and pricing.
* `doctors` – Stores doctor profiles and specialties.
* `admins` – Stores admin credentials with hashed passwords.
* `appointments` – Tracks client details, doctor/service references, time slots, status (`pending`, `approved`, `rejected`, `cancelled`), and unique `lookup_code`.

---

## ⚡ Getting Started Locally

### Prerequisites
* Node.js (v18+)
* PostgreSQL installed locally or a managed database URI (e.g., Neon/Supabase)

---

### 1. Backend Setup

Clone the repository:
`git clone https://github.com/your-username/dental-clinic-system.git`

Navigate to backend directory:
`cd dental-clinic-backend`

Install dependencies:
`npm install`

Create a `.env` file in the root of the backend folder:
`PORT=5000`
`DATABASE_URL=postgres://username:password@localhost:5432/dental_clinic`
`JWT_SECRET=your_super_secret_jwt_key`
`NODE_ENV=development`

Initialize database schema:
`npm run init-db`

Seed dummy doctors & services:
`npm run seed`

Start development server:
`npm run dev`

---

### 2. Frontend Setup

Navigate to frontend directory:
`cd ../dental-clinic-frontend`

Install dependencies:
`npm install`

Start Vite dev server:
`npm run dev`

Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints Summary

* `GET /api/services` – Fetch all available services (Public)
* `GET /api/doctors` – Fetch all available doctors (Public)
* `POST /api/appointments` – Submit a new appointment (Public)
* `GET /api/appointments/lookup` – Search appointment by code & email (Public)
* `PATCH /api/appointments/cancel-by-client` – Cancel appointment by client (Public)
* `POST /api/auth/login` – Admin login & receive JWT token (Public)
* `GET /api/appointments` – View all appointments (Admin JWT Required)
* `PATCH /api/appointments/:id/status` – Update appointment status (Admin JWT Required)

---

## 📄 License

This project is open-source and available under the MIT License.