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

export interface PopupViewProps {
  title: string;
  description: string;
  mediaSrc?: string;
  mediaType?: "image" | "video";
  buttonText: string;
  onButtonClick?: () => void;
  onClose?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  onSelectElementById?: (id: string) => void;
  imagePosition?: "left" | "right";
  isOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  imageWrapperClassName?: string;
  imageClassName?: string;
  videoClassName?: string;
  contentWrapperClassName?: string;
  contentWrapperStyle?: React.CSSProperties;
  titleClassName?: string;
  descriptionClassName?: string;
  buttonClassName?: string;
  buttonTextClassName?: string;
  closeButtonClassName?: string;
  metadata?: PopupSettingsSchema;
  type?: "builder" | "preview" | "live";
}

export interface PopupTemplate {
  id: string;
  name: string;
  description?: string;
  props: PopupViewProps;
  isBlank?: boolean;
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