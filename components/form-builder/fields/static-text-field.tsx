"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";

import { produce } from "immer";
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icons";
import type { FieldProps } from "./types";
import { Input } from "@/components/ui/input";

export function StaticTextFieldComponent({ field, updateField }: FieldProps) {
  const { content, textSize, showIcon, iconName } = field.extraAttributes || {};
  const IconComponent =
    showIcon && iconName ? iconMap[iconName as keyof typeof iconMap] : null;
  const sizeClass = `text-${textSize}`;

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(content);
  }, [content]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value != undefined && value.trim() && value !== content) {
      const newField = produce(field, (draft) => {
        if (draft.extraAttributes) {
          draft.extraAttributes.content = value;
        }
      });
      updateField(field.id, newField);
    } else {
      setValue(content); // Revert if empty or unchanged
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setValue(content);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {IconComponent && <IconComponent className={cn("h-6 w-6", sizeClass)} />}
      {isEditing ? (
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn("h-auto font-semibold", sizeClass)}
        />
      ) : (
        <p
          className={cn("font-semibold cursor-pointer", sizeClass)}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {content}
        </p>
      )}
    </div>
  );
}
