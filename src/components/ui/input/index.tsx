import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

// Define base styles for the input
const inputBaseStyles = {
  base: 'custom-input', // Base class for input
};

// Define input variants using class-variance-authority
const inputVariants = cva({
  base: 'custom-input', // Base class for input
  variants: {
    primary: 'bg-blue-500 text-white', // Variant styles for primary input
    success: 'bg-green-500 text-white', // Variant styles for success input
    error: 'bg-red-500 text-white', // Variant styles for error input
    disabled: 'bg-gray-300 text-gray-600 cursor-not-allowed', // Variant styles for disabled input
    // Add more variants as needed
  },
  defaultVariants: {
    variant: 'primary', // Default variant to apply if not specified
  },
});

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: keyof typeof inputVariants; // Variant prop to specify input style
  className?: string; // Accept className prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, ...props }, ref) => {
  // Apply base styles and variant styles
  const inputClasses = `${inputBaseStyles.base} ${variant ? inputVariants[variant] : ''} ${className || ''}`;

  return <input className={inputClasses} ref={ref} {...props} />;
});


Input.displayName = 'Input';

export default Input;
