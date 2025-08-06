import type React from "react";
import type { LucideIcon } from "lucide-react";
import type { FieldProps } from "@/components/form-builder/fields/types";
import type { PropertiesProps } from "@/components/form-builder/properties/types";

export type FormElementType =
  | "text"
  | "textarea"
  | "checkbox"
  | "checkbox-group"
  | "email"
  | "number"
  | "date"
  | "time"
  | "select"
  | "radio"
  | "file"
  | "signature"
  | "rating"
  | "hidden"
  | "password"
  | "color"
  // New static elements
  | "static-text"
  | "note"
  | "download";

export type FormElementCategory =
  | "Standard Fields"
  | "Choice Fields"
  | "Date & Time"
  | "Advanced Fields"
  | "Static Elements";

export interface FormElement {
  type: FormElementType;
  label: string;
  icon: LucideIcon;
  category: FormElementCategory;
  extraAttributes?: Record<string, string>;
  formComponent: React.FC<FieldProps>;
  propertiesComponent: React.FC<PropertiesProps>;
  previewComponent?: React.FC<{ field: FormField }>;
}

export interface FormField {
  id: string;
  type: FormElementType;
  label: string;
  extraAttributes?: Record<string, string | string[] | boolean | number>;
}

export interface DownloadableFile {
  id: string;
  name: string;
  url: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  imageUrl?: string | null;
  saveToDatabase?: boolean;
  tableName?: string;
  fields: FormField[];
  theme?: string;
  customCss?: string;
  downloadableFiles?: DownloadableFile[];
  recaptchaSettings?: {
    enabled: boolean;
    invisible: boolean;
    siteKey: string;
    secretKey: string;
  };
}
