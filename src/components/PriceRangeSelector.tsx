import React, { useState, useEffect } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  currency?: string;
  className?: string;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ 
  min, 
  max, 
  step = 1, 
  value, 
  onChange, 
  formatValue = (val) => `${val}`,
  currency = "₹",
  className
}, ref) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [minInputValue, setMinInputValue] = useState<string>(value[0].toString());
  const [maxInputValue, setMaxInputValue] = useState<string>(value[1].toString());

  // Update local state when props change
  useEffect(() => {
    setLocalValue(value);
    setMinInputValue(value[0].toString());
    setMaxInputValue(value[1].toString());
  }, [value]);

  const handleValueChange = (newValue: number[]) => {
    if (newValue.length === 2) {
      setLocalValue([newValue[0], newValue[1]]);
      setMinInputValue(newValue[0].toString());
      setMaxInputValue(newValue[1].toString());
      onChange([newValue[0], newValue[1]]);
    }
  };

  // Handle min input change
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMinInputValue(newValue);
    
    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue)) {
      // Ensure min value doesn't exceed max value and stays within bounds
      const validatedValue = Math.min(Math.max(numValue, min), localValue[1]);
      setLocalValue([validatedValue, localValue[1]]);
      onChange([validatedValue, localValue[1]]);
    }
  };

  // Handle max input change
  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMaxInputValue(newValue);
    
    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue)) {
      // Ensure max value isn't less than min value and stays within bounds
      const validatedValue = Math.max(Math.min(numValue, max), localValue[0]);
      setLocalValue([localValue[0], validatedValue]);
      onChange([localValue[0], validatedValue]);
    }
  };

  // Handle blur events for input validation
  const handleMinBlur = () => {
    if (minInputValue === "" || isNaN(parseInt(minInputValue, 10))) {
      setMinInputValue(localValue[0].toString());
      return;
    }
    
    const numValue = parseInt(minInputValue, 10);
    const validatedValue = Math.min(Math.max(numValue, min), localValue[1]);
    setMinInputValue(validatedValue.toString());
    setLocalValue([validatedValue, localValue[1]]);
    onChange([validatedValue, localValue[1]]);
  };

  const handleMaxBlur = () => {
    if (maxInputValue === "" || isNaN(parseInt(maxInputValue, 10))) {
      setMaxInputValue(localValue[1].toString());
      return;
    }
    
    const numValue = parseInt(maxInputValue, 10);
    const validatedValue = Math.max(Math.min(numValue, max), localValue[0]);
    setMaxInputValue(validatedValue.toString());
    setLocalValue([localValue[0], validatedValue]);
    onChange([localValue[0], validatedValue]);
  };

  return (
    <div className="space-y-6">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        min={min}
        max={max}
        step={step}
        value={localValue}
        onValueChange={handleValueChange}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-200">
          <SliderPrimitive.Range className="absolute h-full bg-neutral-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full border-2 border-solid border-white bg-neutral-500 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Min value"
        />
        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full border-2 border-solid border-white bg-neutral-500 ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Max value"
        />
      </SliderPrimitive.Root>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="mb-1 text-xs font-medium text-neutral-500">Min</div>
          <div className="flex items-center">
            <span className="mr-1 text-neutral-500">{currency}</span>
            <Input
              type="text"
              value={minInputValue}
              onChange={handleMinInputChange}
              onBlur={handleMinBlur}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="mb-1 text-xs font-medium text-neutral-500">Max</div>
          <div className="flex items-center">
            <span className="mr-1 text-neutral-500">{currency}</span>
            <Input
              type="text"
              value={maxInputValue}
              onChange={handleMaxInputChange}
              onBlur={handleMaxBlur}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

RangeSlider.displayName = "RangeSlider";

export default RangeSlider;