import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    `bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white
     shadow-lg shadow-primary-500/30
     hover:shadow-xl hover:shadow-primary-500/40 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800
     active:shadow-md`,
  secondary:
    `bg-surface-100 text-surface-700 border border-surface-200
     hover:bg-surface-200 hover:border-surface-300
     shadow-sm hover:shadow`,
  danger:
    `bg-gradient-to-br from-red-500 to-red-600 text-white
     shadow-lg shadow-red-500/25
     hover:shadow-xl hover:shadow-red-500/35 hover:from-red-600 hover:to-red-700`,
  ghost:
    'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
  outline:
    `border-2 border-primary-400/60 text-primary-600
     hover:bg-primary-50 hover:border-primary-500`,
};

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`
        relative inline-flex items-center justify-center gap-2.5 font-semibold rounded-2xl
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.97]
        cursor-pointer
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4.5 h-4.5 animate-spin" />
      ) : icon ? (
        <span className="w-4.5 h-4.5 flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
