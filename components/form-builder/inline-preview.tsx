"use client";

import type { Form } from "@/lib/types";
import { PublicFormRenderer } from "./public-form-renderer";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function InlinePreview({ form }: { form: Form }) {
  return (
    <form className="h-full w-full p-4 sm:p-8">
      {form.customCss && <style>{form.customCss}</style>}
      <div
        data-theme={form.theme || "default"}
        className="max-w-lg mx-auto bg-background dark:bg-card rounded-lg shadow-xl p-8 space-y-6"
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
          <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
          <p className="text-muted-foreground">{form.description}</p>
        </div>

        <PublicFormRenderer form={form} />

        <Button
          // type="submit"
          className="w-full"
          onClick={() => alert("Form submitted! (This is a preview)")}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
