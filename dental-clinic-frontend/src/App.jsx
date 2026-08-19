import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ClientLookup from './components/ClientLookup';
import { Calendar, Stethoscope, ShieldCheck, Clock, UserCheck, PhoneCall, Award } from 'lucide-react';

function App() {
  const [view, setView] = useState('home'); // 'home', 'book', 'lookup', 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* --- Sticky Navbar --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            onClick={() => setView('home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Apex Dental
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => setView('home')} 
              className={`hover:text-blue-600 transition ${view === 'home' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => setView('lookup')} 
              className={`hover:text-blue-600 transition ${view === 'lookup' ? 'text-blue-600 font-semibold' : ''}`}
            >
              My Booking
            </button>
            <button 
              onClick={() => setView('admin')} 
              className={`hover:text-blue-600 transition ${view === 'admin' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Admin Portal
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('book')}
              className="hidden sm:inline-flex bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Visit
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                <path d="M3 12h18M3 6h18M3 18h18"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 shadow-sm">
          <div className="px-6 py-4 flex flex-col gap-3">
            <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="text-left text-slate-700 py-2">Home</button>
            <button onClick={() => { setView('lookup'); setMobileMenuOpen(false); }} className="text-left text-slate-700 py-2">My Booking</button>
            <button onClick={() => { setView('admin'); setMobileMenuOpen(false); }} className="text-left text-slate-700 py-2">Admin Portal</button>
            <button onClick={() => { setView('book'); setMobileMenuOpen(false); }} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">Book Visit</button>
          </div>
        </div>
      )}

      {/* --- Main Content Routing --- */}
      <main className="flex-1">
        
        {/* View 1: Home Page */}
        {view === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50 py-20 lg:py-28">
              <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Trusted Dental Excellence
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    A Brighter Smile Starts With Better Care.
                  </h1>
                  <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                    Experience gentle, modern dentistry tailored to your schedule. Book top-rated specialist doctors in under two minutes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                    <button
                      onClick={() => setView('book')}
                      className="bg-blue-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition"
                    >
                      Book Appointment Now
                    </button>
                    <button
                      onClick={() => setView('lookup')}
                      className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50 transition"
                    >
                      Find Existing Booking
                    </button>
                  </div>
                </div>

                {/* Hero Feature Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-3 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Zero Wait Times</h3>
                    <p className="text-xs text-slate-500">Instant online scheduling aligned with doctor availability.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-3 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                    <UserCheck className="w-8 h-8 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Certified Specialists</h3>
                    <p className="text-xs text-slate-500">Board-certified doctors across orthodontic & endodontic care.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-3 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                    <Award className="w-8 h-8 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Modern Tech</h3>
                    <p className="text-xs text-slate-500">Painless procedures with state-of-the-art equipment.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-3 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                    <PhoneCall className="w-8 h-8 text-blue-600" />
                    <h3 className="font-bold text-slate-900">Easy Lookup</h3>
                    <p className="text-xs text-slate-500">Manage or cancel your appointments anytime with a code.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Action CTA Banner */}
            <section className="bg-blue-900 text-white py-12">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold">Ready to schedule your dental visit?</h2>
                  <p className="text-blue-200 text-sm mt-1">Select your service, choose a doctor, and pick your time.</p>
                </div>
                <button
                  onClick={() => setView('book')}
                  className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                >
                  Schedule Appointment
                </button>
              </div>
            </section>
          </div>
        )}

        {/* View 2: Booking Form Container */}
        {view === 'book' && (
          <div className="py-12 max-w-4xl mx-auto px-6">
            <button 
              onClick={() => setView('home')} 
              className="text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 inline-flex items-center gap-1"
            >
              ← Back to Home
            </button>
            <BookingForm />
          </div>
        )}

        {/* View 3: Lookup Appointment */}
        {view === 'lookup' && (
          <div className="py-12 max-w-4xl mx-auto px-6">
            <button 
              onClick={() => setView('home')} 
              className="text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 inline-flex items-center gap-1"
            >
              ← Back to Home
            </button>
            <ClientLookup />
          </div>
        )}

        {/* View 4: Admin Portal */}
        {view === 'admin' && (
          <div className="py-12 max-w-6xl mx-auto px-6">
            {isAuthenticated ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
            )}
          </div>
        )}

      </main>

      {/* --- Professional Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <Stethoscope className="w-5 h-5 text-blue-500" /> Apex Dental Clinic
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Providing patient-centered dental health care using modern digital workflows.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setView('home')} className="hover:text-white transition">Home</button></li>
              <li><button onClick={() => setView('book')} className="hover:text-white transition">Book Appointment</button></li>
              <li><button onClick={() => setView('lookup')} className="hover:text-white transition">Manage Booking</button></li>
              <li><button onClick={() => setView('admin')} className="hover:text-white transition">Admin Login</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Clinic Hours</h4>
            <p className="text-xs text-slate-400">Mon - Fri: 8:00 AM - 6:00 PM</p>
            <p className="text-xs text-slate-400 mt-1">Saturday: 9:00 AM - 2:00 PM</p>
            <p className="text-xs text-slate-400 mt-1">Sunday: Closed</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} Apex Dental Clinic. All rights reserved.</span>
          <span className="text-slate-500">Built with React, Express, and PostgreSQL</span>
        </div>
      </footer>

    </div>
  );
}

export default App;