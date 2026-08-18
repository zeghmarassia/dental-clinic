# 🦷 Dental Clinic Booking System

A full-stack, commercially ready web application for managing dental clinic appointments. Built using **React**, **Tailwind CSS**, **Express.js**, and **PostgreSQL**, this system provides a seamless booking experience for patients and an intuitive management panel for administrators.

---

## ✨ Features

### 👤 Patient / Client Side
* **Service & Doctor Selection:** Browse available dental services and select specialist doctors.
* **Interactive Slot Picker:** Choose convenient dates and time slots with automatic double-booking prevention.
* **Instant Booking Code:** Receives a unique 6-character booking code (e.g., `X7B9K2`) upon submission.
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

```bash
# Clone the repository
git clone [https://github.com/your-username/dental-clinic-system.git](https://github.com/your-username/dental-clinic-system.git)

# Navigate to backend directory
cd dental-clinic-backend

# Install dependencies
npm install