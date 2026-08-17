import React, { useEffect, useState } from 'react';
import { fetchAppointments, updateAppointmentStatus } from '../api';

export default function AdminDashboard({ onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetchAppointments();
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to fetch appointments. Ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      // Update state locally for real-time update
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );
    } catch (err) {
      console.error('Update status error details:', err.response?.data || err.message);
      alert(`Failed to update status: ${err.response?.data?.error || 'Server error'}`);
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
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colors[status] || 'bg-gray-100'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">Manage client bookings and status requests</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No appointments found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase">
                <th className="p-3">Client</th>
                <th className="p-3">Service</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">{app.client_name}</div>
                    <div className="text-xs text-gray-500">{app.client_email} | {app.client_phone}</div>
                  </td>
                  <td className="p-3">{app.service_name || 'N/A'}</td>
                  <td className="p-3">{app.doctor_name || 'N/A'}</td>
                  <td className="p-3">
                    <div>{new Date(app.appointment_date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{app.appointment_time}</div>
                  </td>
                  <td className="p-3">{getStatusBadge(app.status)}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(app.id, 'approved')}
                        disabled={app.status === 'approved'}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'rejected')}
                        disabled={app.status === 'rejected'}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-yellow-600 rounded hover:bg-yellow-700 disabled:opacity-40"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'cancelled')}
                        disabled={app.status === 'cancelled'}
                        className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-40"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}