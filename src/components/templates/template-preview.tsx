"use client";

import React from "react";
import { TemplateRenderer } from "./template-renderer";
import { defaultPreviewData } from "@/data/templates";
import type { PreviewMode, TemplateCustomization } from "@/types/template";

interface TemplatePreviewProps {
  templateId: string;
  mode?: PreviewMode;
  customization?: Partial<TemplateCustomization>;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateId,
  mode = "desktop",
  customization,
  className,
}) => {
  // Default customization
  const defaultCustomization: TemplateCustomization = {
    colorScheme: "default",
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      scale: "normal",
    },
    layout: {
      type: "sidebar",
      spacing: "normal",
    },
    sections: {
      hero: { isVisible: true, order: 1, style: "default" },
      about: { isVisible: true, order: 2, style: "default" },
      experience: { isVisible: true, order: 3, style: "default" },
      education: { isVisible: true, order: 4, style: "default" },
      skills: { isVisible: true, order: 5, style: "default" },
      projects: { isVisible: true, order: 6, style: "default" },
      contact: { isVisible: true, order: 7, style: "default" },
    },
    ...customization,
  };

  return (
    <div className={className}>
      <TemplateRenderer
        templateId={templateId}
        data={defaultPreviewData}
        customization={defaultCustomization}
        mode={mode}
      />
    </div>
  );
};