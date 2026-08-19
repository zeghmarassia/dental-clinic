import React, { useState } from 'react';
import { lookupAppointment, cancelAppointmentByClient } from '../api';

export default function ClientLookup() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setAppointment(null);
    setLoading(true);

    try {
      const res = await lookupAppointment(code, email);
      setAppointment(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Appointment not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    setError('');
    setMessage('');

    try {
      await cancelAppointmentByClient(code, email);
      setMessage('Appointment successfully cancelled.');
      setAppointment((prev) => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel appointment.');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[status] || 'bg-gray-100'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Find Your Appointment</h2>

      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking Code</label>
          <input
            type="text"
            required
            placeholder="e.g. X7B9K2"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full p-2.5 border border-gray-300 rounded-lg uppercase tracking-wider font-semibold focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Searching...' : 'Search Appointment'}
        </button>
      </form>

      {appointment && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block">Booking Code</span>
              <span className="font-semibold text-gray-800 tracking-wider">{code}</span>
            </div>
            <div>
              <button
                onClick={() => { navigator.clipboard?.writeText(code); setMessage('Code copied to clipboard.'); setTimeout(() => setMessage(''), 2000); }}
                className="px-3 py-1 text-xs bg-slate-100 rounded hover:bg-slate-200"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-500">Status:</span>
            {getStatusBadge(appointment.status)}
          </div>

          <div>
            <span className="text-xs text-gray-500 block">Service</span>
            <span className="font-semibold text-gray-800">{appointment.service_name} (${appointment.service_price})</span>
          </div>

          <div>
            <span className="text-xs text-gray-500 block">Doctor</span>
            <span className="font-semibold text-gray-800">{appointment.doctor_name} ({appointment.doctor_specialty})</span>
          </div>

          <div>
            <span className="text-xs text-gray-500 block">Date & Time</span>
            <span className="font-semibold text-gray-800">
              {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
            </span>
          </div>

          {appointment.status !== 'cancelled' && (
            <button
              onClick={handleCancel}
              className="w-full mt-4 bg-red-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-700 transition"
            >
              Cancel This Appointment
            </button>
          )}
        </div>
      )}
    </div>
  );
}