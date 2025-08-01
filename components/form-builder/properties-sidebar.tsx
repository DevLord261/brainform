"use client";

import type React from "react";
import { produce } from "immer";
import type { Form, FormField } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IconPicker } from "./icon-picker";
import { ColorPicker } from "./color-picker";
import { FormElements } from "@/lib/form-elements";

interface PropertiesSidebarProps {
  form: Form;
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  fields: FormField[];
  selectedField: FormField | null;
  updateField: (id: string, field: FormField) => void;
}

export function PropertiesSidebar({
  form,
  setForm,
  fields,
  selectedField,
  updateField,
}: PropertiesSidebarProps) {
  const handleAttributeChange = (attribute: string, value: string) => {
    if (selectedField) {
      const newField = produce(selectedField, (draft) => {
        if (attribute === "label") {
          draft.label = value;
        } else if (draft.extraAttributes) {
          if (attribute === "options") {
            draft.extraAttributes[attribute] = value.split("\n");
          } else {
            draft.extraAttributes[attribute] = value;
          }
        }
      });
      updateField(selectedField.id, newField);
    }
  };

  const hasValidationOptions =
    selectedField?.extraAttributes &&
    ("required" in selectedField.extraAttributes ||
      "minLength" in selectedField.extraAttributes ||
      "minSelections" in selectedField.extraAttributes);

  const hasDisplayOptions =
    selectedField?.extraAttributes &&
    ("showIcon" in selectedField.extraAttributes ||
      "labelColor" in selectedField.extraAttributes ||
      "hintText" in selectedField.extraAttributes);

  const PropertiesComponent = selectedField
    ? FormElements.find((el) => el.type === selectedField.type)
        ?.propertiesComponent
    : null;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <h2 className="text-xl font-bold">Properties</h2>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedField ? (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-muted-foreground">
              Select a field to see its properties
            </p>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold mb-2">{selectedField.label}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Type: {selectedField.type}
            </p>
            <Accordion
              type="multiple"
              defaultValue={["general", "validation", "display"]}
              className="w-full"
            >
              <AccordionItem value="general">
                <AccordionTrigger>General</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="label">Label / Internal Name</Label>
                    <Input
                      id="label"
                      value={selectedField.label}
                      onChange={(e) =>
                        handleAttributeChange("label", e.target.value)
                      }
                    />
                  </div>
                  {selectedField.extraAttributes?.placeholder !== undefined && (
                    <div>
                      <Label htmlFor="placeholder">Placeholder</Label>
                      <Input
                        id="placeholder"
                        value={selectedField.extraAttributes.placeholder}
                        onChange={(e) =>
                          handleAttributeChange("placeholder", e.target.value)
                        }
                      />
                    </div>
                  )}
                  {selectedField.extraAttributes?.defaultValue !== undefined &&
                    selectedField.type !== "checkbox" && (
                      <div>
                        <Label htmlFor="defaultValue">Default Value</Label>
                        <Input
                          id="defaultValue"
                          value={selectedField.extraAttributes.defaultValue}
                          onChange={(e) =>
                            handleAttributeChange(
                              "defaultValue",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    )}
                  {selectedField.extraAttributes?.dbColumnName !== undefined &&
                    form.saveToDatabase && (
                      <div>
                        <Label htmlFor="dbColumnName">
                          Database Column Name
                        </Label>
                        <Input
                          id="dbColumnName"
                          value={selectedField.extraAttributes.dbColumnName}
                          onChange={(e) =>
                            handleAttributeChange(
                              "dbColumnName",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    )}
                  {selectedField.extraAttributes?.options !== undefined && (
                    <div>
                      <Label htmlFor="options">Options</Label>
                      <Textarea
                        id="options"
                        rows={5}
                        value={selectedField.extraAttributes.options.join("\n")}
                        onChange={(e) =>
                          handleAttributeChange("options", e.target.value)
                        }
                        placeholder="Enter one option per line"
                      />
                    </div>
                  )}
                  {PropertiesComponent &&
                    !["password", "checkbox-group"].includes(
                      selectedField.type,
                    ) && (
                      <PropertiesComponent
                        field={selectedField}
                        onAttributeChange={handleAttributeChange}
                        form={form}
                        setForm={setForm}
                        fields={fields}
                      />
                    )}
                </AccordionContent>
              </AccordionItem>

              {hasValidationOptions && (
                <AccordionItem value="validation">
                  <AccordionTrigger>Validation</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {selectedField.extraAttributes?.required !== undefined && (
                      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <Label>Required</Label>
                        <Switch
                          checked={selectedField.extraAttributes.required}
                          onCheckedChange={(checked) =>
                            handleAttributeChange("required", checked)
                          }
                        />
                      </div>
                    )}
                    {PropertiesComponent &&
                      ["password", "checkbox-group"].includes(
                        selectedField.type,
                      ) && (
                        <PropertiesComponent
                          field={selectedField}
                          onAttributeChange={handleAttributeChange}
                          fields={fields}
                        />
                      )}
                  </AccordionContent>
                </AccordionItem>
              )}

              {hasDisplayOptions && (
                <AccordionItem value="display">
                  <AccordionTrigger>Display Settings</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    {selectedField.extraAttributes?.showIcon !== undefined && (
                      <>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                          <Label>Show Icon</Label>
                          <Switch
                            checked={selectedField.extraAttributes.showIcon}
                            onCheckedChange={(checked) =>
                              handleAttributeChange("showIcon", checked)
                            }
                          />
                        </div>
                        {selectedField.extraAttributes.showIcon && (
                          <div>
                            <Label htmlFor="iconName">Icon</Label>
                            <IconPicker
                              value={selectedField.extraAttributes.iconName}
                              onChange={(value) =>
                                handleAttributeChange("iconName", value)
                              }
                            />
                          </div>
                        )}
                      </>
                    )}
                    {selectedField.extraAttributes?.labelColor !==
                      undefined && (
                      <div>
                        <Label>Label Color</Label>
                        <ColorPicker
                          value={selectedField.extraAttributes.labelColor}
                          onChange={(color) =>
                            handleAttributeChange("labelColor", color)
                          }
                        />
                      </div>
                    )}
                    {selectedField.extraAttributes?.hintText !== undefined && (
                      <div>
                        <Label htmlFor="hintText">Hint Text (Tooltip)</Label>
                        <Textarea
                          id="hintText"
                          value={selectedField.extraAttributes.hintText}
                          onChange={(e) =>
                            handleAttributeChange("hintText", e.targe.value)
                          }
                          placeholder="Enter helpful text for the user."
                          rows={3}
                        />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
