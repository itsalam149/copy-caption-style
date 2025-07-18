// components/ui/ColorPicker.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string; // Hex color string
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 border-none rounded-md cursor-pointer overflow-hidden appearance-none [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
        // Tailwind JIT might not compile `[&::-webkit-color-swatch-wrapper]:p-0` directly.
        // You might need a custom CSS file for these if they don't apply.
      />
      <Input
        type="text"
        value={value.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};

export default ColorPicker;
