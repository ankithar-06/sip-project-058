import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  autoComplete = 'current-password',
  className = '',
  disabled = false,
  'aria-describedby': ariaDescribedBy,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative flex items-center">
      {/* Left Lock Icon */}
      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none select-none" />

      {/* Password Input Field */}
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-describedby={ariaDescribedBy}
        className={`w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      />

      {/* Show / Hide Toggle Button */}
      <button
        type="button"
        onClick={togglePasswordVisibility}
        tabIndex={0}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
        className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Eye className="w-4 h-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
