import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonStyles = {
  base: 'button__primary',
  primary: 'button__primary',
  secondary: 'button__secondary',
};

const buttonVariants = cva('my-button', {
  variants: {
    variant: {
      primary: buttonStyles.primary,
      secondary: buttonStyles.secondary,
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    // Apply the button variants using class-variance-authority
    const classNames = buttonVariants({ variant, className });

    return <button className={classNames} ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
