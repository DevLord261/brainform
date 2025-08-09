"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { iconMap } from "@/lib/icons";
import type { FormField } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface FieldLabelProps {
  field: FormField;
  onUpdateLabel: (newLabel: string) => void;
}

export function FieldLabel({ field, onUpdateLabel }: FieldLabelProps) {
  const { showIcon, iconName, labelColor, hintText, required } =
    field.extraAttributes || {};
  const IconComponent =
    showIcon && iconName ? iconMap[iconName as keyof typeof iconMap] : null;

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(field.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(field.label);
  }, [field.label]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() && value !== field.label) {
      onUpdateLabel(value);
    } else {
      setValue(field.label); // Revert if empty or unchanged
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setValue(field.label);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {IconComponent && (
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      )}
      {isEditing ? (
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-8 font-medium"
        />
      ) : (
        <Label
          htmlFor={field.id}
          className="font-medium cursor-pointer"
          style={{ color: (labelColor as string) || undefined }}
          onClick={() => setIsEditing(true)}
        >
          {field.label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {hintText && !isEditing && (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="cursor-help"
                onClick={(e) => e.preventDefault()}
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{hintText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
