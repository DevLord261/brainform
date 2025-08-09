"use client";

import { useState } from "react";
// import { Eye, EyeOff, UploadCloud, Star, Info, Download } from "lucide-react";
import {
  Eye,
  EyeOff,
  UploadCloud,
  Star,
  Info,
  Download,
  X,
  File,
} from "lucide-react";

import type { Form, FormField } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { iconMap } from "@/lib/icons";
import Image from "next/image";

const PublicLabel = ({ field }: { field: FormField }) => (
  <Label htmlFor={field.id} className="font-medium text-sm">
    {field.label}
    {field.extraAttributes?.required && (
      <span className="text-red-500 ml-1">*</span>
    )}
  </Label>
);

export function PublicFieldRenderer({
  field,
  form,
}: {
  field: FormField;
  form: Form;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [rating, setRating] = useState(
    field.extraAttributes?.defaultValue || 0,
  );
  const maxStars = field.extraAttributes?.maxStars || 5;
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const removeFile = (indexToRemove: number) => {
    if (!selectedFiles) return;

    const dt = new DataTransfer();
    Array.from(selectedFiles).forEach((file, index) => {
      if (index !== indexToRemove) {
        dt.items.add(file);
      }
    });

    const input = document.getElementById(field.id) as HTMLInputElement;
    if (input) {
      input.files = dt.files;
      setSelectedFiles(dt.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
      case "time":
        return (
          <Input
            id={field.id}
            name={field.id}
            type={field.type}
            placeholder={field.extraAttributes?.placeholder}
            required={field.extraAttributes?.required}
          />
        );
      case "password":
        return (
          <div className="relative">
            <Input
              id={field.id}
              name={field.id}
              type={showPassword ? "text" : "password"}
              placeholder={field.extraAttributes?.placeholder}
              required={field.extraAttributes?.required}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        );
      case "textarea":
        return (
          <Textarea
            id={field.id}
            name={field.id}
            placeholder={field.extraAttributes?.placeholder}
            required={field.extraAttributes?.required}
          />
        );
      case "select":
        return (
          <Select name={field.id} required={field.extraAttributes?.required}>
            <SelectTrigger id={field.id}>
              <SelectValue
                placeholder={
                  field.extraAttributes?.placeholder || "Select an option"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {field.extraAttributes?.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      // case "file":
      //   return (
      //     <div className="flex items-center justify-center w-full">
      //       <label
      //         htmlFor={field.id}
      //         className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
      //       >
      //         <div className="flex flex-col items-center justify-center pt-5 pb-6">
      //           <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
      //           <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
      //             <span className="font-semibold">Drag & drop files here</span>
      //           </p>
      //           <p className="text-xs text-gray-500 dark:text-gray-400">
      //             or click to browse
      //           </p>
      //         </div>
      //         <Input
      //           id={field.id}
      //           name={field.id}
      //           type="file"
      //           className="hidden"
      //           multiple={field.extraAttributes?.multipleFiles}
      //           accept={field.extraAttributes?.allowedFileTypes}
      //           required={field.extraAttributes?.required}
      //         />
      //       </label>
      //     </div>
      //   );
      case "file":
        const isMultiple = field.extraAttributes?.multipleFiles;

        const handleFileSelection = (
          newFiles: FileList | null,
          isAddingMore = false,
        ) => {
          if (!newFiles || newFiles.length === 0) return;

          const input = document.getElementById(field.id) as HTMLInputElement;
          if (!input) return;

          let finalFiles: File[] = [];

          if (
            isMultiple &&
            isAddingMore &&
            selectedFiles &&
            selectedFiles.length > 0
          ) {
            // Add to existing files
            finalFiles = [
              ...Array.from(selectedFiles),
              ...Array.from(newFiles),
            ];
          } else {
            // Replace files (single file mode or first selection or replace all)
            finalFiles = Array.from(newFiles);
          }

          // Create new DataTransfer with all files
          const dt = new DataTransfer();
          finalFiles.forEach((file) => {
            dt.items.add(file);
          });

          // Update the input's files
          input.files = dt.files;
          setSelectedFiles(dt.files);

          console.log(`Total files now: ${dt.files.length}`); // Debug log
        };

        const removeFile = (indexToRemove: number) => {
          if (!selectedFiles) return;

          const remainingFiles = Array.from(selectedFiles).filter(
            (_, index) => index !== indexToRemove,
          );

          const dt = new DataTransfer();
          remainingFiles.forEach((file) => {
            dt.items.add(file);
          });

          const input = document.getElementById(field.id) as HTMLInputElement;
          if (input) {
            input.files = dt.files;
            setSelectedFiles(dt.files);
          }
        };

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor={
                  selectedFiles && selectedFiles.length > 0 && isMultiple
                    ? ""
                    : field.id
                }
                className={cn(
                  "flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                  selectedFiles && selectedFiles.length > 0
                    ? "h-20 bg-green-50 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-700 dark:hover:bg-green-900/30"
                    : "h-32 bg-gray-50 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600",
                )}
              >
                <div className="flex flex-col items-center justify-center p-4">
                  {selectedFiles && selectedFiles.length > 0 ? (
                    <>
                      <UploadCloud className="w-6 h-6 mb-2 text-green-500" />
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {selectedFiles.length} file
                        {selectedFiles.length > 1 ? "s" : ""} selected
                      </p>
                      <p className="text-xs text-green-500 dark:text-green-500">
                        {isMultiple
                          ? "Use button below to add more"
                          : "Click to change file"}
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Drag & drop files here
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        or click to browse
                      </p>
                    </>
                  )}
                </div>
              </label>

              {/* Hidden file input */}
              <Input
                id={field.id}
                name={field.id}
                type="file"
                className="hidden"
                multiple={isMultiple}
                accept={field.extraAttributes?.allowedFileTypes}
                required={field.extraAttributes?.required}
                onChange={(e) => handleFileSelection(e.target.files, false)}
              />
            </div>

            {/* Add More Files Button (only for multiple files when files are selected) */}
            {isMultiple && selectedFiles && selectedFiles.length > 0 && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Create a temporary file input for adding more files
                    const tempInput = document.createElement("input");
                    tempInput.type = "file";
                    tempInput.multiple = true;
                    if (field.extraAttributes?.allowedFileTypes) {
                      tempInput.accept = field.extraAttributes.allowedFileTypes;
                    }
                    tempInput.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files && target.files.length > 0) {
                        handleFileSelection(target.files, true); // isAddingMore = true
                      }
                    };
                    tempInput.click();
                  }}
                  className="flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Add More Files
                </Button>
              </div>
            )}

            {/* File List */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="space-y-2">
                {Array.from(selectedFiles).map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {file.type.startsWith("image/") ? (
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onLoad={(e) => {
                              URL.revokeObjectURL(
                                (e.target as HTMLImageElement).src,
                              );
                            }}
                            width={100}
                            height={100}
                          />
                        </div>
                      ) : (
                        <File className="w-8 h-8 text-gray-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              name={field.id}
              required={field.extraAttributes?.required}
            />
            <Label htmlFor={field.id} className="font-medium text-sm">
              {field.label}
              {field.extraAttributes?.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </Label>
          </div>
        );
      case "checkbox-group":
        return (
          <div className="space-y-2">
            {field.extraAttributes?.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option}`}
                  name={field.id}
                  value={option}
                />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup
            name={field.id}
            required={field.extraAttributes?.required}
          >
            {field.extraAttributes?.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "rating":
        return (
          <div className="flex gap-1">
            <input type="hidden" name={field.id} value={rating} />
            {[...Array(maxStars)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-6 w-6 cursor-pointer",
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300",
                )}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
        );
      case "signature":
        return (
          <div className="w-full h-32 border-2 border-dashed rounded-lg bg-gray-50 flex items-center justify-center">
            <input type="hidden" name={field.id} value="" />
            <p className="text-muted-foreground">Signature Area</p>
          </div>
        );
      case "color":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="color"
              id={field.id}
              name={field.id}
              defaultValue={field.extraAttributes?.defaultValue}
              className="h-10 w-10 p-1"
            />
            <Input
              type="text"
              value={field.extraAttributes?.defaultValue}
              className="w-24"
              readOnly
            />
          </div>
        );
      case "static-text": {
        const { content, textSize, showIcon, iconName } =
          field.extraAttributes || {};
        const IconComponent =
          showIcon && iconName
            ? iconMap[iconName as keyof typeof iconMap]
            : null;
        const sizeClass = `text-${textSize}`;
        return (
          <div className="flex items-center gap-2">
            {IconComponent && (
              <IconComponent className={cn("h-6 w-6", sizeClass)} />
            )}
            <p className={cn("font-semibold", sizeClass)}>{content}</p>
          </div>
        );
      }
      case "note": {
        const { content, style } = field.extraAttributes || {};
        const styleClasses = {
          info: "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200",
          warning:
            "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200",
          success:
            "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200",
          destructive:
            "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200",
        };
        return (
          <div
            className={cn(
              "p-4 border-l-4 rounded-r-lg",
              styleClasses[style as keyof typeof styleClasses] ||
                styleClasses.info,
            )}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{content}</p>
              </div>
            </div>
          </div>
        );
      }
      case "download": {
        const { linkText, source, url, fileId } = field.extraAttributes || {};
        let fileUrl = "#";
        let fileName = "";

        if (url != undefined && source === "url") {
          fileUrl = url;
        } else if (source === "upload" && form.downloadableFiles) {
          const foundFile = form.downloadableFiles.find((f) => f.id === fileId);
          if (foundFile) {
            fileUrl = foundFile.url;
            fileName = foundFile.name;
          }
        }

        return (
          <Button asChild variant="outline">
            <a href={fileUrl} download={fileName || true}>
              <Download className="mr-2 h-4 w-4" />
              {linkText}
            </a>
          </Button>
        );
      }
      default:
        return (
          <Input
            id={field.id}
            name={field.id}
            type="text"
            placeholder={`Unsupported field: ${field.type}`}
            disabled
          />
        );
    }
  };

  if (field.type === "hidden") return null;

  // Special case for single checkbox to avoid double label
  if (
    field.type === "checkbox" ||
    field.type.startsWith("static-") ||
    ["note", "download"].includes(field.type)
  ) {
    return renderField();
  }

  return (
    <div className="grid w-full items-center gap-1.5">
      <PublicLabel field={field} />
      {renderField()}
    </div>
  );
}
