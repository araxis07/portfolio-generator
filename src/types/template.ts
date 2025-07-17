// Portfolio Template Types
export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  features: string[];
  preview: {
    thumbnail: string;
    images: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  };
  config: TemplateConfig;
  colorSchemes: ColorScheme[];
  layoutOptions: LayoutOption[];
  customization: CustomizationOptions;
  isNew?: boolean;
  isPopular?: boolean;
  isPremium?: boolean;
}

export type TemplateCategory = 
  | "modern" 
  | "classic" 
  | "creative" 
  | "minimal" 
  | "academic" 
  | "developer" 
  | "business" 
  | "artistic";

export interface TemplateConfig {
  layout: {
    type: "sidebar" | "header" | "split" | "single-column";
    sidebarPosition?: "left" | "right";
    headerStyle?: "fixed" | "static" | "sticky";
    maxWidth: string;
    spacing: "compact" | "normal" | "spacious";
  };
  sections: {
    [key: string]: SectionConfig;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont?: string;
    scale: "small" | "normal" | "large";
  };
  components: {
    navigation: NavigationConfig;
    hero: HeroConfig;
    cards: CardConfig;
    buttons: ButtonConfig;
  };
  responsive: {
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    behavior: ResponsiveBehavior;
  };
}

export interface SectionConfig {
  isVisible: boolean;
  order: number;
  style: "default" | "card" | "minimal" | "highlighted";
  background?: string;
  padding?: string;
  margin?: string;
}

export interface ColorScheme {
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
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    destructive: string;
    destructiveForeground: string;
    ring: string;
  };
  gradients?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  config: Partial<TemplateConfig>;
}

export interface CustomizationOptions {
  colors: {
    canCustomize: boolean;
    presets: ColorScheme[];
  };
  typography: {
    canCustomize: boolean;
    fontOptions: FontOption[];
  };
  layout: {
    canCustomize: boolean;
    options: LayoutOption[];
  };
  sections: {
    canReorder: boolean;
    canToggleVisibility: boolean;
    canCustomizeStyle: boolean;
  };
}

export interface FontOption {
  id: string;
  name: string;
  family: string;
  weights: number[];
  category: "serif" | "sans-serif" | "monospace" | "display";
  preview: string;
}

export interface NavigationConfig {
  type: "horizontal" | "vertical" | "hamburger" | "dots";
  position: "top" | "bottom" | "left" | "right" | "floating";
  style: "minimal" | "pills" | "underline" | "background";
}

export interface HeroConfig {
  layout: "centered" | "left" | "right" | "split";
  backgroundType: "solid" | "gradient" | "image" | "pattern";
  showAvatar: boolean;
  showSocialLinks: boolean;
  animationType: "none" | "fade" | "slide" | "typewriter";
}

export interface CardConfig {
  style: "flat" | "elevated" | "outlined" | "minimal";
  borderRadius: "none" | "small" | "medium" | "large" | "full";
  shadow: "none" | "small" | "medium" | "large";
  hover: "none" | "lift" | "scale" | "glow";
}

export interface ButtonConfig {
  style: "solid" | "outline" | "ghost" | "link";
  size: "small" | "medium" | "large";
  borderRadius: "none" | "small" | "medium" | "large" | "full";
}

export interface ResponsiveBehavior {
  navigation: "collapse" | "stack" | "scroll";
  sidebar: "hide" | "overlay" | "push";
  cards: "stack" | "grid" | "carousel";
}

// Template Preview Types
export interface TemplatePreview {
  templateId: string;
  mode: PreviewMode;
  data: PreviewData;
  customization: TemplateCustomization;
}

export type PreviewMode = "desktop" | "tablet" | "mobile";

export interface PreviewData {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    avatar?: string;
    location?: string;
    email?: string;
    phone?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    link?: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
}

export interface TemplateCustomization {
  colorScheme: string;
  typography: {
    headingFont: string;
    bodyFont: string;
    scale: "small" | "normal" | "large";
  };
  layout: {
    type: string;
    spacing: "compact" | "normal" | "spacious";
  };
  sections: {
    [key: string]: {
      isVisible: boolean;
      order: number;
      style: string;
    };
  };
}

// Template Selection Types
export interface TemplateSelection {
  templateId: string;
  colorSchemeId: string;
  layoutOptionId?: string;
  customization: TemplateCustomization;
  timestamp: Date;
}

export interface TemplateFilter {
  category?: TemplateCategory;
  features?: string[];
  isPremium?: boolean;
  search?: string;
}

export interface TemplateSortOption {
  field: "name" | "category" | "popularity" | "newest";
  direction: "asc" | "desc";
}