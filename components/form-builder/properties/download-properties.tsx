"use client";
import type React from "react";
import { produce } from "immer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Upload } from "lucide-react";
import type { PropertiesProps } from "./types";
import type { DownloadableFile } from "@/lib/types";

export function DownloadProperties({
  field,
  onAttributeChange,
  form,
  setForm,
}: PropertiesProps) {
  const handleDownloadableFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file && setForm) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: DownloadableFile = {
          id: crypto.randomUUID(),
          name: file.name,
          url: reader.result as string,
        };
        setForm(
          produce((draft) => {
            draft.downloadableFiles = [
              ...(draft.downloadableFiles || []),
              newFile,
            ];
          }),
        );
        onAttributeChange("fileId", newFile.id);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="linkText">Link Text</Label>
        <Input
          id="linkText"
          value={field.extraAttributes?.linkText}
          onChange={(e) => onAttributeChange("linkText", e.target.value)}
        />
      </div>
      <div>
        <Label>File Source</Label>
        <RadioGroup
          value={field.extraAttributes?.source}
          onValueChange={(value) => onAttributeChange("source", value)}
          className="flex gap-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="url" id="source-url" />
            <Label htmlFor="source-url">URL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="upload" id="source-upload" />
            <Label htmlFor="source-upload">File Upload</Label>
          </div>
        </RadioGroup>
      </div>
      {field.extraAttributes?.source === "url" && (
        <div>
          <Label htmlFor="url">File URL</Label>
          <Input
            id="url"
            value={field.extraAttributes?.url}
            onChange={(e) => onAttributeChange("url", e.target.value)}
            placeholder="https://example.com/file.pdf"
          />
        </div>
      )}
      {field.extraAttributes?.source === "upload" && (
        <div>
          <Label htmlFor="fileId">Select File</Label>
          <Select
            value={field.extraAttributes?.fileId}
            onValueChange={(value) => onAttributeChange("fileId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or upload a file..." />
            </SelectTrigger>
            <SelectContent>
              {(form?.downloadableFiles || []).map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
              <Separator className="my-1" />
              <div className="p-1">
                <Input
                  id="new-file-upload-properties"
                  type="file"
                  className="hidden"
                  onChange={handleDownloadableFileUpload}
                />
                <Label
                  htmlFor="new-file-upload-properties"
                  className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-md hover:bg-accent"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload new file</span>
                </Label>
              </div>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Upload files in Form Settings &gt; Downloadable Files.
          </p>
        </div>
      )}
    </>
  );
}
