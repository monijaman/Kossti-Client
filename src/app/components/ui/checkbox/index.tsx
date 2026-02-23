import React, { ChangeEventHandler, ReactNode } from 'react';

// Define props interface for Checkbox component
interface CheckboxProps {
    name: string; // Name of the checkbox
    value?: boolean; // Whether the checkbox is checked (optional, default: false)
    updateValue: (newValue: boolean, name: string) => void; // Function to update checkbox value
    label?: string; // Optional label for the checkbox
    children?: ReactNode; // Optional child components passed to the checkbox
}

// Checkbox component
const Checkbox = ({ name, value = false, updateValue, label, children }: CheckboxProps) => {
    // Event handler for checkbox change
    const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
        // Call the updateValue function with the new checkbox value and name
        updateValue(!value, name);
    };

    return (
        <label htmlFor={`${name}-checkbox`} className="flex items-center gap-2">
            {/* Checkbox input */}
            <input
                type="checkbox"
                id={`${name}-checkbox`}
                name={name}
                checked={value}
                onChange={handleChange}
            />
            {/* Display label if provided */}
            {label && <span>{label}</span>}
            {/* Display children if provided */}
            {children}
        </label>
    );
};

export default Checkbox;
