import React from 'react';
import { Check, X } from 'lucide-react';
import { validatePassword } from '../utils/passwordValidator';

const PasswordRequirements = ({ password, showOnlyWhenTyping = true }) => {
  if (showOnlyWhenTyping && (!password || password.length === 0)) {
    return null;
  }

  const { criteria, strengthScore, strengthLabel, strengthColor, textColor } = validatePassword(password);

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2.5 text-xs transition-all">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400">Password Strength:</span>
          <span className={`font-semibold ${textColor}`}>{strengthLabel}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${strengthScore}%` }}
          />
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="space-y-1.5 pt-1">
        {criteria.map((item) => (
          <div key={item.id} className="flex items-center space-x-2 text-[11px]">
            {item.met ? (
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
            ) : (
              <div className="w-3.5 h-3.5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                <div className="w-1 h-1 rounded-full bg-slate-500" />
              </div>
            )}
            <span className={item.met ? 'text-slate-200 font-medium' : 'text-slate-400'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
