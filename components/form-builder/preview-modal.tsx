"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Form } from "@/lib/types";
import { PublicFormRenderer } from "./public-form-renderer";
import { BrainCircuit, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface PreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  form: Form;
}

export function PreviewModal({
  isOpen,
  onOpenChange,
  form,
}: PreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-full max-h-full flex flex-col bg-gray-100 dark:bg-background p-0">
        {form.customCss && <style>{form.customCss}</style>}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div
            data-theme={form.theme || "default"}
            className="max-w-lg mx-auto bg-white dark:bg-card rounded-lg shadow-xl p-8 space-y-6"
          >
            <div className="text-center space-y-4">
              {form.imageUrl ? (
                <Image
                  src={form.imageUrl || "/placeholder.svg"}
                  alt="Form banner"
                  className="rounded-md mb-4 max-h-48 w-full object-cover mx-auto"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="flex flex-col items-center text-center">
                  <BrainCircuit className="h-12 w-12" />
                  <p className="text-sm font-bold tracking-wider">BRAINSPACE</p>
                </div>
              )}
              <h1 className="text-2xl font-bold tracking-tight">
                {form.title}
              </h1>
            </div>

            <PublicFormRenderer form={form} />

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={() => {
                alert("Form submitted! (This is a preview)");
                onOpenChange(false);
              }}
            >
              Submit Request
            </Button>
          </div>
        </div>
        {form.recaptchaSettings?.enabled &&
          form.recaptchaSettings.invisible && (
            <div className="absolute bottom-4 right-4">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex flex-col items-center justify-center border text-muted-foreground shadow">
                <ShieldCheck className="h-6 w-6" />
                <p className="text-[8px] mt-1">reCAPTCHA</p>
              </div>
            </div>
          )}
      </DialogContent>
    </Dialog>
  );
}
