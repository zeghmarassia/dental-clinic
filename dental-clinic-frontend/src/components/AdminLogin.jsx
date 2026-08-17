import React, { useState } from 'react';
import { loginAdmin } from '../api';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginAdmin({ email, password });
      localStorage.setItem('adminToken', res.data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Portal Login</h2>

      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white font-medium py-3 rounded-lg hover:bg-slate-800 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}