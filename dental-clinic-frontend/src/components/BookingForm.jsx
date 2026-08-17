import React, { useState, useEffect } from 'react';
import { fetchServices, fetchDoctors, createAppointment, fetchBookedSlots } from '../api';

export default function BookingForm() {
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    service_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '09:00:00',
    client_name: '',
    client_email: '',
    client_phone: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices().then((res) => setServices(res.data)).catch(console.error);
    fetchDoctors().then((res) => setDoctors(res.data)).catch(console.error);
  }, []);

  // Predefined working hours array
const TIME_SLOTS = ['09:00:00', '10:00:00', '11:00:00', '13:00:00', '14:00:00', '15:00:00'];
const [bookedSlots, setBookedSlots] = useState([]);

// Fetch occupied slots whenever doctor or date changes
useEffect(() => {
  if (formData.doctor_id && formData.appointment_date) {
    fetchBookedSlots(formData.doctor_id, formData.appointment_date)
      .then((res) => setBookedSlots(res.data))
      .catch(console.error);
  }
}, [formData.doctor_id, formData.appointment_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await createAppointment(formData);
      setMessage(res.data.message);
      setFormData({
        service_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '09:00:00',
        client_name: '',
        client_email: '',
        client_phone: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit appointment.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

      {message && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">{message}</div>}
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
          <select
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.service_id}
            onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
          >
            <option value="">-- Choose a Service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
          <select
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.doctor_id}
            onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.appointment_date}
            onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const isBooked = bookedSlots.some((bookedSlot) => bookedSlot.appointment_time === slot);
              return (
                <label
                  key={slot}
                  className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition duration-200 ${
                    isBooked
                      ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60'
                      : formData.appointment_time === slot
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="time_slot"
                    value={slot}
                    checked={formData.appointment_time === slot}
                    disabled={isBooked}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                    className="mr-2"
                  />
                  <span className={`font-medium ${isBooked ? 'line-through text-gray-500' : ''}`}>
                    {slot.slice(0, 5)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.client_email}
              onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="+123456789"
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.client_phone}
              onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Confirm & Book Appointment
        </button>
      </form>
    </div>
  );
}