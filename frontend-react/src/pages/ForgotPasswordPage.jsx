import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PasswordInput from '../components/PasswordInput';
import PasswordRequirements from '../components/PasswordRequirements';
import { validatePassword } from '../utils/passwordValidator';
import { authApi } from '../api/client';
import {
  Building2,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // Workflow Steps: 'email' (Step 1) -> 'otp' (Step 2/3) -> 'reset' (Step 4) -> 'success' (Step 5)
  const [step, setStep] = useState('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Resend OTP Cooldown timer (60 seconds)
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordStatus = validatePassword(newPassword);

  // STEP 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid registered email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi.forgotPassword(trimmedEmail);
      setSuccessMsg(res.data.message || 'If your email is registered, a 6-digit verification code has been dispatched.');
      setResendCooldown(60);
      setStep('otp');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Unable to request verification code. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await authApi.forgotPassword(email.trim());
      setSuccessMsg(res.data.message || 'A fresh verification code has been dispatched.');
      setResendCooldown(60);
      setOtp('');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to resend code.');
    } finally {
      setSubmitting(false);
    }
  };

  // STEP 3: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const trimmedOtp = otp.trim();
    if (trimmedOtp.length !== 6 || !/^\d{6}$/.test(trimmedOtp)) {
      setError('Please enter the complete 6-digit numeric verification code.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi.verifyOtp(email.trim(), trimmedOtp);
      setResetToken(res.data.reset_token);
      setSuccessMsg('Verification code approved. You can now set your new password.');
      setStep('reset');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid or expired verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  // STEP 4: Submit New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordStatus.isValid) {
      setError('Password does not meet all security requirements. Please check the rules below.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi.resetPassword(email.trim(), resetToken, newPassword);
      setSuccessMsg(res.data.message || 'Password reset successfully!');
      setStep('success');
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to reset password. Please start the process again.');
    } finally {
      setSubmitting(false);
    }
  };

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            {/* Header Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Account Recovery</h2>
              <p className="text-xs text-slate-400 mt-1">
                {step === 'email' && 'Enter your registered email to receive a password reset code.'}
                {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
                {step === 'reset' && 'Create a strong, new password for your account.'}
                {step === 'success' && 'Your password has been reset successfully.'}
              </p>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Info Banner */}
            {successMsg && step !== 'success' && (
              <div className="mb-5 p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* STEP 1: Email Form */}
            {step === 'email' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. owner@msmeconnect.in"
                      autoComplete="email"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
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
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2 & 3: OTP Verification Form */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      6-Digit Verification Code *
                    </label>
                    <span className="text-[11px] text-amber-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Valid for 10 min</span>
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={submitting || otp.length !== 6}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || submitting}
                      className="text-blue-400 hover:text-blue-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center space-x-1 font-medium cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 4: Reset Password Form */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    New Password *
                  </label>
                  <PasswordInput
                    id="new-password"
                    name="newPassword"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    autoComplete="new-password"
                  />
                  <PasswordRequirements password={newPassword} showOnlyWhenTyping={true} />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirm New Password *
                  </label>
                  <PasswordInput
                    id="confirm-new-password"
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />
                  {passwordsMatch && (
                    <p className="mt-1.5 text-[11px] text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>Passwords match</span>
                    </p>
                  )}
                  {passwordsMismatch && (
                    <p className="mt-1.5 text-[11px] text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Passwords do not match yet</span>
                    </p>
                  )}
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
                        <span>Reset Password & Complete</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: Success State */}
            {step === 'success' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Password Reset Complete</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Your MSME Connect AI account credentials have been securely updated. You can now sign in with your new password.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Navigation */}
            {step !== 'success' && (
              <div className="mt-6 pt-6 border-t border-slate-700/60 text-center text-xs text-slate-400">
                Remember your credentials?{' '}
                <Link to="/login" className="text-blue-400 font-semibold hover:underline">
                  Sign in here
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
