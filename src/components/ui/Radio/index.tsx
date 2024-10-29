import React, { ChangeEventHandler, ReactNode } from 'react';

// Define props interface for RadioButton component
interface RadioButtonProps {
    name: string;
    value: string | number; // Allow `value` to represent an id instead of a boolean
    selectedValue: string | number; // Update to match `value` type
    updateValue: (newValue: string | number, name: string) => void; // Update to match `value` type
    children?: ReactNode;
}

// RadioButton component
const RadioButton = ({ name, value, selectedValue, updateValue, children }:RadioButtonProps) => {
    // Event handler for radio button change
    const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
        updateValue(value, name); // Pass `value` as the selected id
    };
    return (
        <label>
        <input
            type="radio"
            name={name}
            checked={selectedValue === value}
            onChange={handleChange}
        />
        {children}
    </label>
    );
};

export default RadioButton;
