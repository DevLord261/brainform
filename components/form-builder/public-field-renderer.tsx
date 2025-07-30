"use client"

import { useState } from "react"
import { Eye, EyeOff, UploadCloud, Star, Info, Download } from "lucide-react"
import type { Form, FormField } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { iconMap } from "@/lib/icons"

const PublicLabel = ({ field }: { field: FormField }) => (
  <Label htmlFor={field.id} className="font-medium text-sm">
    {field.label}
    {field.extraAttributes?.required && <span className="text-red-500 ml-1">*</span>}
  </Label>
)

export function PublicFieldRenderer({ field, form }: { field: FormField; form: Form }) {
  const [showPassword, setShowPassword] = useState(false)
  const [rating, setRating] = useState(field.extraAttributes?.defaultValue || 0)
  const maxStars = field.extraAttributes?.maxStars || 5

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "date":
      case "time":
        return <Input id={field.id} type={field.type} placeholder={field.extraAttributes?.placeholder} />
      case "password":
        return (
          <div className="relative">
            <Input
              id={field.id}
              type={showPassword ? "text" : "password"}
              placeholder={field.extraAttributes?.placeholder}
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
        )
      case "textarea":
        return <Textarea id={field.id} placeholder={field.extraAttributes?.placeholder} />
      case "select":
        return (
          <Select>
            <SelectTrigger id={field.id}>
              <SelectValue placeholder={field.extraAttributes?.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.extraAttributes?.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "file":
        return (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor={field.id}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Drag & drop files here</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">or click to browse</p>
              </div>
              <Input
                id={field.id}
                type="file"
                className="hidden"
                multiple={field.extraAttributes?.multipleFiles}
                accept={field.extraAttributes?.allowedFileTypes}
              />
            </label>
          </div>
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.id} />
            <Label htmlFor={field.id} className="font-medium text-sm">
              {field.label}
              {field.extraAttributes?.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )
      case "checkbox-group":
        return (
          <div className="space-y-2">
            {field.extraAttributes?.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "radio":
        return (
          <RadioGroup id={field.id}>
            {field.extraAttributes?.options?.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "rating":
        return (
          <div className="flex gap-1">
            {[...Array(maxStars)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-6 w-6 cursor-pointer",
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                )}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
        )
      case "signature":
        return (
          <div className="w-full h-32 border-2 border-dashed rounded-lg bg-gray-50 flex items-center justify-center">
            <p className="text-muted-foreground">Signature Area</p>
          </div>
        )
      case "color":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="color"
              id={field.id}
              defaultValue={field.extraAttributes?.defaultValue}
              className="h-10 w-10 p-1"
            />
            <Input type="text" value={field.extraAttributes?.defaultValue} className="w-24" readOnly />
          </div>
        )
      case "static-text": {
        const { content, textSize, showIcon, iconName } = field.extraAttributes || {}
        const IconComponent = showIcon && iconName ? iconMap[iconName as keyof typeof iconMap] : null
        const sizeClass = `text-${textSize}`
        return (
          <div className="flex items-center gap-2">
            {IconComponent && <IconComponent className={cn("h-6 w-6", sizeClass)} />}
            <p className={cn("font-semibold", sizeClass)}>{content}</p>
          </div>
        )
      }
      case "note": {
        const { content, style } = field.extraAttributes || {}
        const styleClasses = {
          info: "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200",
          warning:
            "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200",
          success:
            "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200",
          destructive:
            "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200",
        }
        return (
          <div
            className={cn(
              "p-4 border-l-4 rounded-r-lg",
              styleClasses[style as keyof typeof styleClasses] || styleClasses.info,
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
        )
      }
      case "download": {
        const { linkText, source, url, fileId } = field.extraAttributes || {}
        let fileUrl = "#"
        let fileName = ""

        if (source === "url") {
          fileUrl = url
        } else if (source === "upload" && form.downloadableFiles) {
          const foundFile = form.downloadableFiles.find((f) => f.id === fileId)
          if (foundFile) {
            fileUrl = foundFile.url
            fileName = foundFile.name
          }
        }

        return (
          <Button asChild variant="outline">
            <a href={fileUrl} download={fileName || true}>
              <Download className="mr-2 h-4 w-4" />
              {linkText}
            </a>
          </Button>
        )
      }
      default:
        return <Input id={field.id} type="text" placeholder={`Unsupported field: ${field.type}`} disabled />
    }
  }

  if (field.type === "hidden") return null

  // Special case for single checkbox to avoid double label
  if (field.type === "checkbox" || field.type.startsWith("static-") || ["note", "download"].includes(field.type)) {
    return renderField()
  }

  return (
    <div className="grid w-full items-center gap-1.5">
      <PublicLabel field={field} />
      {renderField()}
    </div>
  )
}
