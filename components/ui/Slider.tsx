// components/ui/Slider.tsx
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils"; // Assuming '@/lib/utils'

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number[]; // Array for consistency with future range sliders
  onValueChange: (value: number[]) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  value,
  onValueChange,
  className,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState(value[0]);

  useEffect(() => {
    setLocalValue(value[0]);
  }, [value]);

  const getPosition = (val: number) => {
    if (!trackRef.current) return 0;
    const percentage = (val - min) / (max - min);
    return percentage * trackRef.current.offsetWidth;
  };

  const getValueFromPosition = useCallback(
    (position: number) => {
      if (!trackRef.current) return min;
      const trackWidth = trackRef.current.offsetWidth;
      const percentage = Math.max(0, Math.min(1, position / trackWidth));
      let val = min + percentage * (max - min);
      // Snap to step
      val = Math.round(val / step) * step;
      return Math.max(min, Math.min(max, val));
    },
    [min, max, step]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!trackRef.current) return;
      e.preventDefault();

      const trackRect = trackRef.current.getBoundingClientRect();
      const startX = e.clientX;
      const startValue = localValue;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newPosition = getPosition(startValue) + deltaX;
        const newValue = getValueFromPosition(newPosition);
        setLocalValue(newValue);
        onValueChange([newValue]);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [localValue, onValueChange, getPosition, getValueFromPosition]
  );

  return (
    <div
      className={cn(
        "relative flex items-center h-5 w-full cursor-pointer touch-none",
        className
      )}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={trackRef}
        className="relative w-full h-2 bg-sky-blue-100 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${((localValue - min) / (max - min)) * 100}%` }}
        ></div>
      </div>
      <div
        className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full shadow-md -translate-x-1/2"
        style={{ left: `${((localValue - min) / (max - min)) * 100}%` }}
      ></div>
    </div>
  );
};

export default Slider;
