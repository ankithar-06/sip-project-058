import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import { Building2, Mail, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      setError('Please enter your registered email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }

    setSubmitting(true);

    try {
      await login(emailTrimmed, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setFormData({
      email: 'demo@msmeconnect.in',
      password: 'Demo@2026!',
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Owner Sign In</h2>
              <p className="text-xs text-slate-400 mt-1">
                Access your MSME Connect AI business command center.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your-email@domain.com"
                    autoComplete="email"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <PasswordInput
                  id="login-password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Demo Account Filler Button */}
              <button
                type="button"
                onClick={fillDemoAccount}
                className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-amber-300 text-xs border border-slate-700/60 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Fill Demo Account Credentials</span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Don't have an account?</span>
              <Link to="/register" className="text-blue-400 font-semibold hover:underline">
                Register business
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
