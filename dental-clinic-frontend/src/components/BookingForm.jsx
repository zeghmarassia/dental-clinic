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

const [bookingCode, setBookingCode] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  try {
    const res = await createAppointment(formData);
    setMessage(res.data.message);
    setBookingCode(res.data.lookup_code); // Save returned code
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to submit appointment.');
  }
};

  const selectedService = services.find((s) => String(s.id) === String(formData.service_id));
  const selectedDoctor = doctors.find((d) => String(d.id) === String(formData.doctor_id));
  const isFormValid = formData.service_id && formData.doctor_id && formData.appointment_date && formData.appointment_time && formData.client_name && formData.client_email && formData.client_phone;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">

      {message && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">{message}</div>}
      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
      {bookingCode && (
  <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
    <p className="text-sm text-blue-800">Your Unique Booking Code:</p>
    <p className="text-2xl font-bold tracking-widest text-blue-900 my-1">{bookingCode}</p>
    <p className="text-xs text-blue-600">Save this code to check or cancel your appointment later.</p>
  </div>
)}
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
          disabled={!isFormValid}
          className={`w-full ${isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 cursor-not-allowed'} text-white font-medium py-3 rounded-lg transition duration-200`}
        >
          {isFormValid ? 'Confirm & Book Appointment' : 'Complete all fields to continue'}
        </button>
      </form>
        </div>

        {/* Summary Card */}
        <aside className="hidden lg:block lg:col-span-1 p-4 bg-slate-50 rounded-lg border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Appointment Summary</h3>
          <div className="mt-3 text-sm text-gray-600 space-y-3">
            <div>
              <div className="text-xs text-gray-500">Service</div>
              <div className="font-medium text-gray-800">{selectedService ? `${selectedService.name}` : 'Not selected'}</div>
              {selectedService && <div className="text-xs text-gray-500">Price: ${selectedService.price}</div>}
            </div>

            <div>
              <div className="text-xs text-gray-500">Doctor</div>
              <div className="font-medium text-gray-800">{selectedDoctor ? `${selectedDoctor.name}` : 'Not selected'}</div>
              {selectedDoctor && <div className="text-xs text-gray-500">{selectedDoctor.specialty}</div>}
            </div>

            <div>
              <div className="text-xs text-gray-500">Date & Time</div>
              <div className="font-medium text-gray-800">{formData.appointment_date ? new Date(formData.appointment_date).toLocaleDateString() : 'Not selected'}</div>
              <div className="text-xs text-gray-500">{formData.appointment_time ? formData.appointment_time.slice(0,5) : ''}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Slots unavailable</div>
              <div className="font-medium text-gray-800">{bookedSlots.length} booked</div>
            </div>

            <div className="pt-3">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-lg">Need help?</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}