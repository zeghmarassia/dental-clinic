import React from 'react';
import BookingForm from './components/BookingForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-2xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-blue-900">Dental Care Clinic</h1>
        <p className="text-gray-600 mt-1">Schedule your visit with our specialist doctors</p>
      </header>
      <BookingForm />
    </div>
  );
}

export default App;