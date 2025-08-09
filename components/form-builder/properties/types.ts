import type React from "react";
import type { Form, FormField } from "@/lib/types";

export interface PropertiesProps {
  field: FormField;
  onAttributeChange: (attribute: string, value: string) => void;
  form?: Form;
  setForm?: React.Dispatch<React.SetStateAction<Form>>;
  fields?: FormField[];
}
