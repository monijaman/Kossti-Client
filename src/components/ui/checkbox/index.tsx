import React, { ChangeEventHandler, ReactNode } from 'react';

// Define props interface for Checkbox component
interface CheckboxProps {
    name: string; // Name of the checkbox
    value?: boolean; // Whether the checkbox is checked (optional, default: false)
    updateValue: (newValue: boolean, name: string) => void; // Function to update checkbox value
    children?: ReactNode; // Child components passed to the checkbox (optional)
}

// Checkbox component
const Checkbox: React.FC<CheckboxProps> = ({ name, value = false, updateValue, children }) => {
    // Event handler for checkbox change
    const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
        // Call the updateValue function with the new checkbox value and name
        updateValue(!value, name);
    };

    return (
        <label>
            {/* Checkbox input */}
            <input type="checkbox" id={`${name}-checkbox`} name={name} checked={value} onChange={handleChange} />
            {/* Child components */}
            {children}
        </label>
    );
};

export default Checkbox;
