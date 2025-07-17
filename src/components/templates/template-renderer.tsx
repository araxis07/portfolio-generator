"use client";

import React from "react";
import { ModernProfessionalTemplate } from "./modern-professional";
import { CreativePortfolioTemplate } from "./creative-portfolio";
import { DeveloperFocusTemplate } from "./developer-focus";
import { MinimalCleanTemplate } from "./minimal-clean";
import { AcademicResearchTemplate } from "./academic-research";
import type { TemplateProps } from "./types";

interface TemplateRendererProps extends TemplateProps {
  templateId: string;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  templateId,
  data,
  customization,
  mode,
  className,
}) => {
  const templateComponents = {
    "modern-professional": ModernProfessionalTemplate,
    "creative-portfolio": CreativePortfolioTemplate,
    "developer-focus": DeveloperFocusTemplate,
    "minimal-clean": MinimalCleanTemplate,
    "academic-research": AcademicResearchTemplate,
  };

  const TemplateComponent = templateComponents[templateId as keyof typeof templateComponents];

  if (!TemplateComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-muted-foreground">Template Not Found</h2>
          <p className="text-muted-foreground">
            The template "{templateId}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TemplateComponent
      data={data}
      customization={customization}
      mode={mode}
      className={className}
    />
  );
};