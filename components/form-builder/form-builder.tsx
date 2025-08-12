"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { produce } from "immer";
import { Code, Braces } from "lucide-react";
import { saveFormAction } from "@/app/dashboard/forms/[formId]/actions";
import type { FormWithId } from "@/lib/memory-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { Form, FormElement, FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCanvas } from "./form-canvas";
import { PropertiesSidebar } from "./properties-sidebar";
import { FormBuilderSidebar } from "./form-builder-sidebar";
import { CustomCssModal } from "./custom-css-modal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FormSettings } from "./form-settings";
import { InlinePreview } from "./inline-preview";

export function FormBuilder({ initialForm }: { initialForm?: FormWithId }) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormWithId>(
    initialForm || {
      id: crypto.randomUUID(),
      title: "Request New User Access",
      description: "Fill out the form to request access.",
      created_at: new Date(),
      saveToDatabase: false,
      tableName: "",
      imageUrl: null,
      fields: [],
      theme: "default",
      customCss: "",
      recaptchaSettings: {
        enabled: false,
        invisible: true,
        siteKey: "",
        secretKey: "",
      },
    },
  );
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isCssModalOpen, setIsCssModalOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const router = useRouter();

  const setFormAttribute = <K extends keyof Form>(
    attribute: K,
    value: FormWithId[K],
  ) => {
    setForm(
      produce((draft) => {
        draft[attribute] = value;
      }),
    );
  };

  const addField = (element: FormElement) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type: element.type,
      label: `${element.label}`,
      extraAttributes: { ...element.extraAttributes },
    };
    setForm(
      produce((draft) => {
        draft.fields.push(newField);
      }),
    );
    setSelectedField(newField);
  };

  const removeField = (id: string) => {
    setForm(
      produce((draft) => {
        draft.fields = draft.fields.filter((field) => field.id !== id);
      }),
    );
    if (selectedField?.id === id) {
      setSelectedField(null);
    }
  };

  const duplicateField = (id: string) => {
    const fieldToDuplicate = form.fields.find((f) => f.id === id);
    if (!fieldToDuplicate) return;
    const newField: FormField = {
      ...fieldToDuplicate,
      id: crypto.randomUUID(),
      label: `${fieldToDuplicate.label} (Copy)`,
    };
    const index = form.fields.findIndex((f) => f.id === id);
    setForm(
      produce((draft) => {
        draft.fields.splice(index + 1, 0, newField);
      }),
    );
    setSelectedField(newField);
  };

  const updateField = (id: string, newField: FormField) => {
    setForm(
      produce((draft) => {
        const index = draft.fields.findIndex((f) => f.id === id);
        if (index !== -1) {
          draft.fields[index] = newField;
          if (selectedField?.id === id) {
            setSelectedField(newField);
          }
        }
      }),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setForm(
        produce((draft) => {
          const oldIndex = draft.fields.findIndex(
            (item) => item.id === active.id,
          );
          const newIndex = draft.fields.findIndex(
            (item) => item.id === over.id,
          );
          draft.fields = arrayMove(draft.fields, oldIndex, newIndex);
        }),
      );
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveFormAction(form);
      if (result.success) {
        // In a real app, you would use a toast notification here
        // alert("Form saved successfully!");
        router.push("/dashboard");
      } else {
        alert(`Error: ${result.error}`);
      }
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <FormBuilderSidebar addField={addField} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={30}>
            <div className="flex flex-col h-full">
              <header className="p-4 border-b flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <h1 className="text-xl font-bold">Form Builder</h1>
                <div className="flex items-center gap-4">
                  {!isPreviewMode && (
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="theme-select"
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        Form Theme
                      </Label>
                      <Select
                        value={form.theme}
                        onValueChange={(value) =>
                          setFormAttribute("theme", value)
                        }
                      >
                        <SelectTrigger id="theme-select" className="w-[150px]">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {!isPreviewMode && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsCssModalOpen(true)}
                    >
                      <Code className="h-4 w-4" />
                      <span className="sr-only">Add Custom CSS</span>
                    </Button>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                      {isPreviewMode ? "Back to Editor" : "Preview"}
                    </Button>
                    {!isPreviewMode && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsPayloadModalOpen(true)}
                        >
                          <Braces className="h-4 w-4" />
                          <span className="sr-only">Show Payload</span>
                        </Button>
                        <Button onClick={handleSave} disabled={isPending}>
                          {isPending ? "Saving..." : "Save Form"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-hidden bg-muted/40">
                <div className={cn("flip-card", isPreviewMode && "flipped")}>
                  <div className="flip-card-inner">
                    <div className="flip-card-front">
                      <div className="p-4 md:p-6 lg:p-8 space-y-6 h-full">
                        <FormSettings form={form} setForm={setForm} />
                        <FormCanvas
                          fields={form.fields}
                          removeField={removeField}
                          duplicateField={duplicateField}
                          selectedField={selectedField}
                          setSelectedField={setSelectedField}
                          updateField={updateField}
                        />
                      </div>
                    </div>
                    <div className="flip-card-back">
                      <InlinePreview form={form} />
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <PropertiesSidebar
              form={form}
              setForm={setForm}
              fields={form.fields}
              selectedField={selectedField}
              updateField={updateField}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <CustomCssModal
        isOpen={isCssModalOpen}
        onOpenChange={setIsCssModalOpen}
        value={form.customCss || ""}
        onSave={(css) => {
          setFormAttribute("customCss", css);
          setIsCssModalOpen(false);
        }}
      />
      <Dialog open={isPayloadModalOpen} onOpenChange={setIsPayloadModalOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Form Payload</DialogTitle>
            <DialogDescription>
              This is the JSON data that will be sent to the server when you
              save the form.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-md bg-muted p-4 max-h-[60vh] overflow-auto">
            <pre>
              <code className="text-sm">{JSON.stringify(form, null, 2)}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
