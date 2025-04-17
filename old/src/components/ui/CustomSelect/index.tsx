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

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>(options);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  

  const handleSelectOption = (option: OptionType) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

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
