import {
  CaseSensitive,
  CheckSquare,
  Pilcrow,
  Mail,
  Binary,
  CalendarDays,
  ChevronDownSquare,
  CircleDot,
  Upload,
  PenSquare,
  Star,
  EyeOff,
  Key,
  Palette,
  Clock,
  ListChecks,
  Type,
  Info,
  Download,
} from "lucide-react";
import type { FormElement } from "./types";

// Import Field Components
import { TextFieldComponent } from "@/components/form-builder/fields/text-field";
import { EmailFieldComponent } from "@/components/form-builder/fields/email-field";
import { PasswordFieldComponent } from "@/components/form-builder/fields/password-field";
import { NumberFieldComponent } from "@/components/form-builder/fields/number-field";
import { TextareaFieldComponent } from "@/components/form-builder/fields/textarea-field";
import { DateFieldComponent } from "@/components/form-builder/fields/date-field";
import { TimeFieldComponent } from "@/components/form-builder/fields/time-field";
import { CheckboxFieldComponent } from "@/components/form-builder/fields/checkbox-field";
import { CheckboxGroupFieldComponent } from "@/components/form-builder/fields/checkbox-group-field";
import { SelectFieldComponent } from "@/components/form-builder/fields/select-field";
import { RadioGroupFieldComponent } from "@/components/form-builder/fields/radio-group-field";
import { FileUploadFieldComponent } from "@/components/form-builder/fields/file-upload-field";
import { SignatureFieldComponent } from "@/components/form-builder/fields/signature-field";
import { RatingFieldComponent } from "@/components/form-builder/fields/rating-field";
import { ColorPickerFieldComponent } from "@/components/form-builder/fields/color-picker-field";
import { HiddenFieldComponent } from "@/components/form-builder/fields/hidden-field";
import { StaticTextFieldComponent } from "@/components/form-builder/fields/static-text-field";
import { NoteFieldComponent } from "@/components/form-builder/fields/note-field";
import { DownloadFieldComponent } from "@/components/form-builder/fields/download-field";

// Import Properties Components
import { FileProperties } from "@/components/form-builder/properties/file-properties";
import { StaticTextProperties } from "@/components/form-builder/properties/static-text-properties";
import { NoteProperties } from "@/components/form-builder/properties/note-properties";
import { DownloadProperties } from "@/components/form-builder/properties/download-properties";
import { PasswordProperties } from "@/components/form-builder/properties/password-properties";
import { CheckboxGroupProperties } from "@/components/form-builder/properties/checkbox-group-properties";

const NoProperties = () => null;

export const FormElements: FormElement[] = [
  // --- Standard Fields ---
  {
    type: "text",
    label: "Text Field",
    icon: CaseSensitive,
    category: "Standard Fields",
    formComponent: TextFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      placeholder: "Enter text here...",
      required: false,
      defaultValue: "",
      dbColumnName: "",
      showIcon: false,
      iconName: "User",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "email",
    label: "Email Field",
    icon: Mail,
    category: "Standard Fields",
    formComponent: EmailFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      placeholder: "Enter email here...",
      required: false,
      defaultValue: "",
      dbColumnName: "",
      showIcon: true,
      iconName: "Mail",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "password",
    label: "Password Field",
    icon: Key,
    category: "Standard Fields",
    formComponent: PasswordFieldComponent,
    propertiesComponent: PasswordProperties,
    extraAttributes: {
      placeholder: "Enter password...",
      required: false,
      dbColumnName: "",
      showIcon: true,
      iconName: "Lock",
      labelColor: "",
      hintText: "Password must meet criteria.",
      minLength: 8,
      requireNumber: true,
      requireSpecialChar: true,
      confirmationField: "",
    },
  },
  {
    type: "number",
    label: "Number Field",
    icon: Binary,
    category: "Standard Fields",
    formComponent: NumberFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      placeholder: "Enter a number...",
      required: false,
      defaultValue: "",
      dbColumnName: "",
      showIcon: false,
      iconName: "Hash",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "textarea",
    label: "Text Area",
    icon: Pilcrow,
    category: "Standard Fields",
    formComponent: TextareaFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      placeholder: "Enter multi-line text...",
      required: false,
      defaultValue: "",
      dbColumnName: "",
      showIcon: false,
      iconName: "FileText",
      labelColor: "",
      hintText: "",
    },
  },
  // --- Date & Time ---
  {
    type: "date",
    label: "Date Picker",
    icon: CalendarDays,
    category: "Date & Time",
    formComponent: DateFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      required: false,
      defaultValue: "",
      dbColumnName: "",
      showIcon: true,
      iconName: "Calendar",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "time",
    label: "Time Picker",
    icon: Clock,
    category: "Date & Time",
    formComponent: TimeFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      required: false,
      defaultValue: "",
      dbColumnName: "",
      showIcon: true,
      iconName: "Clock",
      labelColor: "",
      hintText: "",
    },
  },
  // --- Choice Fields ---
  {
    type: "checkbox",
    label: "Single Checkbox",
    icon: CheckSquare,
    category: "Choice Fields",
    formComponent: CheckboxFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      required: false,
      defaultValue: false,
      dbColumnName: "",
      showIcon: false,
      iconName: "CheckSquare",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "checkbox-group",
    label: "Checkbox Group",
    icon: ListChecks,
    category: "Choice Fields",
    formComponent: CheckboxGroupFieldComponent,
    propertiesComponent: CheckboxGroupProperties,
    extraAttributes: {
      required: false,
      options: ["Option A", "Option B"],
      dbColumnName: "",
      labelColor: "",
      hintText: "",
      minSelections: 0,
      maxSelections: 0,
    },
  },
  {
    type: "select",
    label: "Select Menu",
    icon: ChevronDownSquare,
    category: "Choice Fields",
    formComponent: SelectFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      placeholder: "Select an option",
      required: false,
      options: ["Option 1", "Option 2", "Option 3"],
      defaultValue: "",
      dbColumnName: "",
      showIcon: false,
      iconName: "ChevronDown",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "radio",
    label: "Radio Group",
    icon: CircleDot,
    category: "Choice Fields",
    formComponent: RadioGroupFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      required: false,
      options: ["Option A", "Option B", "Option C"],
      defaultValue: "",
      dbColumnName: "",
      showIcon: false,
      iconName: "CircleDot",
      labelColor: "",
      hintText: "",
    },
  },
  // --- Advanced Fields ---
  {
    type: "file",
    label: "File Upload",
    icon: Upload,
    category: "Advanced Fields",
    formComponent: FileUploadFieldComponent,
    propertiesComponent: FileProperties,
    extraAttributes: {
      required: false,
      dbColumnName: "",
      multipleFiles: false,
      allowedFileTypes: "image/*", // Default to images
    },
  },
  {
    type: "signature",
    label: "Signature Pad",
    icon: PenSquare,
    category: "Advanced Fields",
    formComponent: SignatureFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      required: false,
      dbColumnName: "",
      showIcon: true,
      iconName: "PenSquare",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "rating",
    label: "Star Rating",
    icon: Star,
    category: "Advanced Fields",
    formComponent: RatingFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      required: false,
      maxStars: 5,
      defaultValue: 0,
      dbColumnName: "",
      showIcon: true,
      iconName: "Star",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "color",
    label: "Color Picker",
    icon: Palette,
    category: "Advanced Fields",
    formComponent: ColorPickerFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      required: false,
      defaultValue: "#000000",
      dbColumnName: "",
      labelColor: "",
      hintText: "",
    },
  },
  {
    type: "hidden",
    label: "Hidden Field",
    icon: EyeOff,
    category: "Advanced Fields",
    formComponent: HiddenFieldComponent,
    propertiesComponent: NoProperties,
    extraAttributes: {
      defaultValue: "",
      dbColumnName: "",
    },
  },
  // --- Static Elements ---
  {
    type: "static-text",
    label: "Static Text",
    icon: Type,
    category: "Static Elements",
    formComponent: StaticTextFieldComponent,
    propertiesComponent: StaticTextProperties,
    extraAttributes: {
      content: "This is some static text.",
      textSize: "base",
      showIcon: false,
      iconName: "Info",
    },
  },
  {
    type: "note",
    label: "Note Block",
    icon: Info,
    category: "Static Elements",
    formComponent: NoteFieldComponent,
    propertiesComponent: NoteProperties,
    extraAttributes: {
      content: "This is an important note for the user.",
      style: "info", // 'info', 'warning', 'success'
    },
  },
  {
    type: "download",
    label: "Download Link",
    icon: Download,
    category: "Static Elements",
    formComponent: DownloadFieldComponent,
    propertiesComponent: DownloadProperties,
    extraAttributes: {
      linkText: "Download File",
      source: "url", // 'url' or 'upload'
      url: "",
      fileId: "",
    },
  },
];
