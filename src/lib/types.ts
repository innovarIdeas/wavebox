import { PopupSettingsSchema } from "./dtos";

export type FormData = {
  name: string;
  email: string;
  phoneNumer: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: "recent" | "deals" | "announcement" | "backToSchool" | "sales";
  buttonText: string;
  buttonAction: () => void;
  isBlank?: boolean;
}

export interface Category {
  id: string;
  label: string;
  value: string;
}

export interface PopupElement {
  id: string;
  type:
    | "heading"
    | "subheading"
    | "image"
    | "video"
    | "button"
    | "column"
    | "text";
  content: string;
  properties?: Record<string, string>;
  style?: Record<string, string>;
}

export interface PopupTemplate {
  id: string;
  elements: PopupElement[];
  background: string;
}

export interface Popup {
  id: string;
  content: PopupTemplate;
  type?: string;
  status: "Active" | "Inactive";
  metadata: PopupSettingsSchema;
  created_at: Date;
  updated_at: Date;
  organization_id?: string;
}