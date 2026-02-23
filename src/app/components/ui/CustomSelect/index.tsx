// components/CustomSelect.tsx
import React, { useState, useEffect, useRef } from 'react';

interface OptionType {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: OptionType[];
  onChange: (value: OptionType | null) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      // Handle click outside the select component
      console.log('Clicked outside the select component');
    }
  };

  

 

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

 

  return (
    <div className="custom-select" ref={selectRef}>
       
    
        <div className="options">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search options..."
          />
          {/* {filteredOptions.map(option => (
            <div
              key={option.value}
              className="option"
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </div>
          ))} */}
        </div>
       
    </div>
  );
};

export default CustomSelect;
