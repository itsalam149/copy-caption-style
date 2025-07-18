// app/editor/components/CaptionPanel.tsx
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
// You'll need to create these UI components
import Dropdown from "@/components/ui/Dropdown"; // Placeholder
import Slider from "@/components/ui/Slider"; // Placeholder
import ColorPicker from "@/components/ui/ColorPicker"; // Placeholder

interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  style: {
    font: string;
    size: number;
    color: string;
    position:
      | "top"
      | "center"
      | "bottom"
      | "top-left"
      | "bottom-left"
      | "top-right"
      | "bottom-right";
    // ... other style properties you extract/support (e.g., bold, italic, outline, shadow)
  };
}

interface CaptionPanelProps {
  selectedCaption: Caption | null;
  onUpdateCaption: (id: string, updates: Partial<Caption>) => void;
}

const fontOptions = [
  { label: "Inter", value: "Inter" },
  { label: "Space Mono", value: "Space Mono" },
  { label: "Arial", value: "Arial" },
  { label: "Roboto", value: "Roboto" },
  { label: "Bebas Neue", value: "Bebas Neue" }, // Example of a common caption font
];

const positionOptions = [
  { label: "Top", value: "top" },
  { label: "Center", value: "center" },
  { label: "Bottom", value: "bottom" },
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
];

const CaptionPanel: React.FC<CaptionPanelProps> = ({
  selectedCaption,
  onUpdateCaption,
}) => {
  if (!selectedCaption) {
    return (
      <div className="p-6 h-full flex items-center justify-center text-gray-500">
        <p className="text-center text-sm">
          Select a caption on the timeline to edit its properties.
        </p>
      </div>
    );
  }

  const handleStyleChange = (key: keyof Caption["style"], value: any) => {
    onUpdateCaption(selectedCaption.id, {
      style: {
        ...selectedCaption.style,
        [key]: value,
      },
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateCaption(selectedCaption.id, { text: e.target.value });
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-none border-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl text-sky-blue-800">
            Edit Caption
          </CardTitle>
          <p className="text-gray-500 text-sm">
            Caption ID: {selectedCaption.id}
          </p>
        </CardHeader>
        <CardContent className="p-0 space-y-6">
          <div>
            <label
              htmlFor="caption-text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Text Content
            </label>
            <textarea
              id="caption-text"
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary text-sm h-24 resize-y"
              value={selectedCaption.text}
              onChange={handleTextChange}
            />
          </div>

          <div>
            <label
              htmlFor="font-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Font
            </label>
            {/* Dropdown component placeholder */}
            <Dropdown
              options={fontOptions}
              value={selectedCaption.style.font}
              onChange={(value) => handleStyleChange("font", value)}
              placeholder="Select font"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Size:{" "}
              <span className="font-semibold">
                {selectedCaption.style.size}px
              </span>
            </label>
            {/* Slider component placeholder */}
            <Slider
              min={12}
              max={100}
              step={1}
              value={[selectedCaption.style.size]}
              onValueChange={(val) => handleStyleChange("size", val[0])}
            />
          </div>

          <div>
            <label
              htmlFor="color-picker"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Color
            </label>
            {/* ColorPicker component placeholder */}
            <ColorPicker
              value={selectedCaption.style.color}
              onChange={(color) => handleStyleChange("color", color)}
            />
          </div>

          <div>
            <label
              htmlFor="position-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Position
            </label>
            {/* Dropdown component placeholder */}
            <Dropdown
              options={positionOptions}
              value={selectedCaption.style.position}
              onChange={(value) => handleStyleChange("position", value)}
              placeholder="Select position"
            />
          </div>

          {/* Add more style controls here based on what you extract from ASS
              e.g., Bold, Italic (checkboxes), Outline (slider/number), Shadow (slider/number)
          */}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaptionPanel;
