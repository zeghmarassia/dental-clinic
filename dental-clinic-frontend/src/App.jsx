import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/react"
import BookingForm from './components/BookingForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ClientLookup from './components/ClientLookup';

function App() {
  const [view, setView] = useState('client'); // 'client' or 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-blue-900">Dental Clinic System</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setView('client')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === 'client' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Client Booking
          </button>
          <button
  onClick={() => setView('lookup')}
  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
    view === 'lookup' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
  }`}
>
  My Appointment
</button>
          <button
            onClick={() => setView('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === 'admin' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Admin Panel
          </button>
        </div>
      </nav>

      <main>
        {view === 'client' && <BookingForm />}
        {view === 'lookup' && <ClientLookup />}
        {view === 'admin' && (
          isAuthenticated ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
          )
        )}
      </main>
    </div>
  );
}

export default App;