/**
 * Password validation rules and strength evaluation utility for MSME Connect AI
 */
export const validatePassword = (password = '') => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);

  const criteria = [
    { id: 'length', label: 'At least 8 characters', met: hasMinLength },
    { id: 'uppercase', label: 'One uppercase letter (A-Z)', met: hasUppercase },
    { id: 'lowercase', label: 'One lowercase letter (a-z)', met: hasLowercase },
    { id: 'number', label: 'One number (0-9)', met: hasNumber },
    { id: 'special', label: 'One special character (!@#$%^&*)', met: hasSpecial },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-red-500';
  let textColor = 'text-red-400';

  if (metCount === 5) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-500';
    textColor = 'text-emerald-400';
  } else if (metCount >= 4) {
    strengthLabel = 'Good';
    strengthColor = 'bg-blue-500';
    textColor = 'text-blue-400';
  } else if (metCount >= 2) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
    textColor = 'text-amber-400';
  }

  return {
    isValid: metCount === 5,
    criteria,
    metCount,
    strengthScore: (metCount / 5) * 100,
    strengthLabel,
    strengthColor,
    textColor,
  };
};
