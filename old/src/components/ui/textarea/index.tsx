import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

// Define base styles for the textarea
const textareaBaseStyles = {
  base: 'custom-textarea', // Base class for textarea
};

// Define textarea variants using class-variance-authority
const textareaVariants = cva({
  base: 'custom-textarea', // Base class for textarea
  variants: {
    primary: 'bg-grey-500 text-white', // Variant styles for primary textarea
 
  },
  defaultVariants: {
    variant: 'primary', // Default variant to apply if not specified
  },
});

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: keyof typeof textareaVariants; // Variant prop to specify textarea style
  className?: string; // Accept className prop
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    // Apply base styles and variant styles
    const textareaClasses = `${textareaBaseStyles.base} ${
      variant ? textareaVariants[variant] : ''
    } ${className || ''}`;

    return <textarea className={textareaClasses} ref={ref} {...props} />;
  }
);

TextArea.displayName = 'Textarea';

export default TextArea;
