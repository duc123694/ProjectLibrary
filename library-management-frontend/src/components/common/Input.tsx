import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, type = 'text', className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-surface-700 tracking-wide"
          >
            {label}
          </label>
        )}
        <div
          className={`
            relative flex items-center rounded-2xl border-2 bg-white
            transition-all duration-300 ease-out
            ${isFocused
              ? 'border-primary-400 shadow-[0_0_0_4px_rgba(99,102,241,0.1)] bg-white'
              : error
                ? 'border-red-300 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
                : 'border-surface-200 hover:border-surface-300 shadow-sm'
            }
          `}
        >
          {icon && (
            <div
              className={`
                pl-4 flex-shrink-0 transition-colors duration-300
                ${isFocused ? 'text-primary-500' : 'text-surface-400'}
              `}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={`
              w-full bg-transparent px-4 py-3.5 text-base text-surface-900
              placeholder:text-surface-400
              focus:outline-none
              ${icon ? 'pl-2.5' : ''}
              ${isPassword ? 'pr-12' : ''}
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors p-0.5"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-red-500 mt-1.5 flex items-center gap-1 animate-fade-in">
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.25a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zM8 11a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-surface-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
