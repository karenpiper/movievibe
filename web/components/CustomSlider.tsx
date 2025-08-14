import { useState } from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface CustomSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export default function CustomSlider({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  step = 0.1,
  description 
}: CustomSliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm font-medium bg-accent px-2 py-1 rounded">
          {value.toFixed(1)}
        </span>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}