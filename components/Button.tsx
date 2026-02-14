
import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm",
    secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 active:scale-95",
    danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
