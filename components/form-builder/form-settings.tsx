"use client";

import type React from "react";
import { produce } from "immer";
import {
  ImagePlus,
  X,
  ShieldCheck,
  Upload,
  Trash2,
  Database,
} from "lucide-react";
import type { Form, DownloadableFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface FormSettingsProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
}

export function FormSettings({ form, setForm }: FormSettingsProps) {
  const setFormAttribute = <K extends keyof Form>(
    attribute: K,
    value: Form[K],
  ) => {
    setForm(
      produce((draft) => {
        draft[attribute] = value;
      }),
    );
  };

  const setRecaptchaAttribute = <
    K extends keyof NonNullable<Form["recaptchaSettings"]>,
  >(
    attribute: K,
    value: NonNullable<Form["recaptchaSettings"]>[K],
  ) => {
    setForm(
      produce((draft) => {
        if (draft.recaptchaSettings) {
          draft.recaptchaSettings[attribute] = value;
        }
      }),
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormAttribute("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadableFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this file to a blob store and get a URL.
      // For now, we'll simulate this with a data URL.
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
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDownloadableFile = (id: string) => {
    setForm(
      produce((draft) => {
        draft.downloadableFiles = draft.downloadableFiles?.filter(
          (f) => f.id !== id,
        );
      }),
    );
  };

  return (
    <Accordion
      type="multiple"
      defaultValue={["general"]}
      className="w-full space-y-4"
    >
      <AccordionItem
        value="general"
        className="bg-background p-6 rounded-lg border"
      >
        <AccordionTrigger className="text-lg font-medium">
          General Settings
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={form.title}
              onChange={(e) => setFormAttribute("title", e.target.value)}
              className="text-2xl font-bold h-auto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              value={form.description}
              onChange={(e) => setFormAttribute("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-image">Form Logo / Image</Label>
            <Card>
              <CardContent className="p-4">
                {form.imageUrl ? (
                  <div className="relative group w-fit">
                    <Image
                      src={form.imageUrl || "/placeholder.svg"}
                      alt="Form banner"
                      className="rounded-md max-h-48 max-w-full h-auto"
                      width={100}
                      height={100}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setFormAttribute("imageUrl", null)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground border-2 border-dashed rounded-lg p-8">
                    <ImagePlus className="h-10 w-10" />
                    <p>Upload a logo or banner</p>
                    <Input
                      id="form-image"
                      type="file"
                      className="sr-only"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    <Button asChild variant="outline" size="sm">
                      <label htmlFor="form-image" className="cursor-pointer">
                        Browse
                      </label>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="database"
        className="bg-background p-6 rounded-lg border"
      >
        <AccordionTrigger className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Integration
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-1">
              <Label>Save submissions to database</Label>
              <p className="text-sm text-muted-foreground">
                When enabled, form submissions will be saved to a database
                table.
              </p>
            </div>
            <Switch
              checked={form.saveToDatabase}
              onCheckedChange={(checked) =>
                setFormAttribute("saveToDatabase", checked)
              }
            />
          </div>
          {form.saveToDatabase && (
            <div className="space-y-2">
              <Label htmlFor="table-name">Database Table Name</Label>
              <Input
                id="table-name"
                value={form.tableName || ""}
                onChange={(e) => setFormAttribute("tableName", e.target.value)}
                placeholder="e.g., user_requests"
              />
              <p className="text-xs text-muted-foreground">
                The name of the table where submissions will be stored.
              </p>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="files"
        className="bg-background p-6 rounded-lg border"
      >
        <AccordionTrigger className="text-lg font-medium">
          Downloadable Files
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              {form.downloadableFiles?.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDownloadableFile(file.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground border-2 border-dashed rounded-lg p-8">
                <Upload className="h-10 w-10" />
                <p>Upload files for users to download</p>
                <Input
                  id="downloadable-file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleDownloadableFileUpload}
                />
                <Button asChild variant="outline" size="sm">
                  <label
                    htmlFor="downloadable-file-upload"
                    className="cursor-pointer"
                  >
                    Browse
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value="recaptcha"
        className="bg-background p-6 rounded-lg border"
      >
        <AccordionTrigger className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            reCAPTCHA Settings
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <Label>Enable reCAPTCHA</Label>
            <Switch
              checked={form.recaptchaSettings?.enabled}
              onCheckedChange={(checked) =>
                setRecaptchaAttribute("enabled", checked)
              }
            />
          </div>
          {form.recaptchaSettings?.enabled && (
            <>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <Label>Invisible reCAPTCHA</Label>
                <Switch
                  checked={form.recaptchaSettings?.invisible}
                  onCheckedChange={(checked) =>
                    setRecaptchaAttribute("invisible", checked)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteKey">Site Key</Label>
                <Input
                  id="siteKey"
                  value={form.recaptchaSettings.siteKey}
                  onChange={(e) =>
                    setRecaptchaAttribute("siteKey", e.target.value)
                  }
                  placeholder="Enter your reCAPTCHA site key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                  id="secretKey"
                  value={form.recaptchaSettings.secretKey}
                  onChange={(e) =>
                    setRecaptchaAttribute("secretKey", e.target.value)
                  }
                  placeholder="Enter your reCAPTCHA secret key"
                />
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
