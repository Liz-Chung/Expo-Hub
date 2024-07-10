import React, { useState } from 'react';
import styles from './Dropdown.module.css';

interface DropdownOption {
  id: number;
  name: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValue: number | null;
  onSelect: (value: number | null) => void;
  placeholder: string;
  isOpen: boolean;
  onToggle: () => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, selectedValue, onSelect, placeholder, isOpen, onToggle }) => {
  const handleSelect = (value: number | null) => {
    onSelect(value);
    onToggle();
  };

  return (
    <div className={styles.dropdown}>
      <div 
        className={`${styles.dropdownToggle} ${selectedValue ? styles.selected : ''}`} 
        onClick={onToggle}
      >
        {selectedValue ? options.find(option => option.id === selectedValue)?.name : placeholder}
        <span className={styles.arrow}></span>
      </div>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map(option => (
            <div 
              key={option.id} 
              className={`${styles.dropdownItem} ${selectedValue === option.id ? styles.selectedItem : ''}`} 
              onClick={() => handleSelect(option.id)}
            >
              {option.name}
            </div>
          ))}
          <div className={styles.dropdownItem} onClick={() => handleSelect(null)}>
            All
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
