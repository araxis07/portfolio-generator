// Core Portfolio Types
export interface Portfolio {
  id: string;
  title: string;
  description: string;
  theme: ThemeConfig;
  sections: PortfolioSection[];
  settings: PortfolioSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioSection {
  id: string;
  type: SectionType;
  title: string;
  content: Record<string, unknown>;
  order: number;
  isVisible: boolean;
  settings: SectionSettings;
}

export type SectionType =
  | "hero"
  | "about"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "testimonials"
  | "contact"
  | "custom";

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
}

export interface PortfolioSettings {
  isPublic: boolean;
  seoTitle: string;
  seoDescription: string;
  socialLinks: SocialLink[];
  customDomain?: string;
  analytics?: AnalyticsConfig;
}

export interface SectionSettings {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
  customCSS?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  isVisible: boolean;
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

// Form Types
export interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "checkbox" | "radio" | "file" | "date";
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface ValidationRule {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: string | number | boolean;
  message: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

// UI Types
export interface DragDropItem {
  id: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  duration?: number;
}

// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Storage Types
export interface LocalStorageData {
  portfolios: Portfolio[];
  currentPortfolio?: string;
  userPreferences: UserPreferences;
  draftData?: Record<string, unknown>;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  autoSave: boolean;
  notifications: boolean;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}
