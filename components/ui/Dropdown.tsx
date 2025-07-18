// components/ui/Dropdown.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming '@/lib/utils'

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-800 bg-white border border-border rounded-lg shadow-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          {selectedOption
            ? selectedOption.label
            : placeholder || "Select an option"}
        </span>
        <svg
          className={cn(
            "w-4 h-4 ml-2 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isOpen && (
        <ul
          className="absolute z-20 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none text-sm"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-sky-blue-50 hover:text-sky-blue-700",
                option.value === value ? "bg-sky-blue-100 font-semibold" : ""
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
