import type { PreviewData, TemplateCustomization, PreviewMode } from "@/types/template";

export interface TemplateProps {
  data: PreviewData;
  customization: TemplateCustomization;
  mode?: PreviewMode;
  className?: string;
}

export interface TemplateComponentProps extends TemplateProps {
  children?: React.ReactNode;
}

export interface TemplateSectionProps {
  data: PreviewData;
  customization: TemplateCustomization;
  sectionKey: string;
  className?: string;
}