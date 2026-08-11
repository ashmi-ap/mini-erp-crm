import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="input-field">
      {label && <span>{label}</span>}
      <input
        className={`input${className ? ` ${className}` : ''}`}
        {...props}
      />
    </label>
  );
}
