import { type NextRequest, NextResponse } from "next/server";
import { portfolioStorage } from "@/lib/storage";
import { portfolioTemplates } from "@/data/templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { portfolioId, templateId, options = {} } = body;

    // Get portfolio data
    const portfolio = portfolioStorage.getById(portfolioId);
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Get template configuration
    const template = portfolioTemplates.find(
      (t) => t.id === (templateId || portfolio.theme.id)
    );
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Validate portfolio data
    const validation = validatePortfolioData(portfolio);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: "Portfolio validation failed",
          validation 
        },
        { status: 400 }
      );
    }

    // Render portfolio with template
    const renderedData = await renderPortfolioWithTemplate(
      portfolio,
      template,
      options
    );

    return NextResponse.json({
      success: true,
      data: renderedData,
      validation,
      template: {
        id: template.id,
        name: template.name,
        category: template.category,
      },
    });
  } catch (error) {
    console.error("Portfolio render error:", error);
    return NextResponse.json(
      { error: "Failed to render portfolio" },
      { status: 500 }
    );
  }
}

function validatePortfolioData(portfolio: any) {
  const validation = {
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
    completeness: 0,
  };

  // Check basic portfolio structure
  if (!portfolio.title) {
    validation.errors.push("Portfolio title is required");
    validation.isValid = false;
  }

  if (!portfolio.sections || !Array.isArray(portfolio.sections)) {
    validation.errors.push("Portfolio sections are required");
    validation.isValid = false;
    return validation;
  }

  // Check for required sections
  const sectionTypes = portfolio.sections.map((s: any) => s.type);
  const requiredSections = ["hero", "about"];
  
  requiredSections.forEach((required) => {
    if (!sectionTypes.includes(required)) {
      validation.errors.push(`Missing required section: ${required}`);
      validation.isValid = false;
    }
  });

  // Validate individual sections
  portfolio.sections.forEach((section: any, index: number) => {
    const sectionValidation = validateSection(section, index);
    validation.errors.push(...sectionValidation.errors);
    validation.warnings.push(...sectionValidation.warnings);
    if (!sectionValidation.isValid) {
      validation.isValid = false;
    }
  });

  // Calculate completeness
  const visibleSections = portfolio.sections.filter((s: any) => s.isVisible);
  const completeSections = visibleSections.filter((s: any) => 
    s.content && Object.keys(s.content).length > 0
  );
  
  validation.completeness = visibleSections.length > 0 
    ? Math.round((completeSections.length / visibleSections.length) * 100) 
    : 0;

  return validation;
}

function validateSection(section: any, index: number) {
  const validation = {
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
  };

  if (!section.type) {
    validation.errors.push(`Section ${index + 1}: Missing section type`);
    validation.isValid = false;
  }

  if (!section.content) {
    validation.warnings.push(`Section ${index + 1}: No content provided`);
    return validation;
  }

  // Validate specific section types
  switch (section.type) {
    case "hero":
      if (!section.content.name) {
        validation.errors.push("Hero section: Name is required");
        validation.isValid = false;
      }
      if (!section.content.title) {
        validation.errors.push("Hero section: Professional title is required");
        validation.isValid = false;
      }
      break;

    case "about":
      if (!section.content.bio) {
        validation.errors.push("About section: Bio/description is required");
        validation.isValid = false;
      }
      break;

    case "experience":
      if (section.content.items && Array.isArray(section.content.items)) {
        section.content.items.forEach((item: any, itemIndex: number) => {
          if (!item.title) {
            validation.warnings.push(`Experience item ${itemIndex + 1}: Title is recommended`);
          }
          if (!item.company) {
            validation.warnings.push(`Experience item ${itemIndex + 1}: Company is recommended`);
          }
        });
      }
      break;

    case "projects":
      if (section.content.items && Array.isArray(section.content.items)) {
        section.content.items.forEach((item: any, itemIndex: number) => {
          if (!item.title) {
            validation.warnings.push(`Project item ${itemIndex + 1}: Title is recommended`);
          }
          if (!item.description) {
            validation.warnings.push(`Project item ${itemIndex + 1}: Description is recommended`);
          }
        });
      }
      break;

    case "skills":
      if (section.content.items && Array.isArray(section.content.items)) {
        if (section.content.items.length === 0) {
          validation.warnings.push("Skills section: No skills listed");
        }
      }
      break;

    case "contact":
      if (!section.content.email && !section.content.phone && !section.content.location) {
        validation.warnings.push("Contact section: At least one contact method is recommended");
      }
      break;
  }

  return validation;
}

async function renderPortfolioWithTemplate(
  portfolio: any,
  template: any,
  options: any
) {
  const renderOptions = {
    includeStyles: options.includeStyles ?? true,
    includeScripts: options.includeScripts ?? true,
    optimizeImages: options.optimizeImages ?? false,
    minify: options.minify ?? false,
    ...options,
  };

  // Process sections for rendering
  const processedSections = portfolio.sections
    .filter((section: any) => section.isVisible)
    .map((section: any) => ({
      ...section,
      content: processContentForTemplate(section.content, section.type, template),
    }));

  // Apply theme configuration
  const themeConfig = {
    ...portfolio.theme,
    template: template.id,
    colors: portfolio.theme.colors || template.defaultColors,
    fonts: portfolio.theme.fonts || template.defaultFonts,
  };

  // Generate CSS variables for theme
  const cssVariables = generateCSSVariables(themeConfig);

  // Prepare metadata
  const metadata = {
    title: portfolio.settings?.seoTitle || `${portfolio.title} - Portfolio`,
    description: portfolio.settings?.seoDescription || `Professional portfolio of ${portfolio.title}`,
    keywords: portfolio.settings?.seoKeywords || [],
    author: portfolio.title,
    viewport: "width=device-width, initial-scale=1.0",
    charset: "UTF-8",
  };

  return {
    portfolio: {
      ...portfolio,
      sections: processedSections,
    },
    template,
    theme: themeConfig,
    cssVariables,
    metadata,
    options: renderOptions,
    renderedAt: new Date().toISOString(),
  };
}

function processContentForTemplate(content: any, sectionType: string, template: any) {
  if (!content) return content;

  // Process content based on section type and template requirements
  const processed = { ...content };

  switch (sectionType) {
    case "hero":
      // Ensure proper formatting for hero content
      if (processed.description) {
        processed.description = processed.description.trim();
      }
      break;

    case "about":
      // Process bio for proper paragraph formatting
      if (processed.bio) {
        processed.bio = processed.bio.trim();
      }
      break;

    case "experience":
    case "projects":
      // Ensure items are properly formatted
      if (processed.items && Array.isArray(processed.items)) {
        processed.items = processed.items.map((item: any) => ({
          ...item,
          description: item.description?.trim(),
        }));
      }
      break;

    case "skills":
      // Group skills by category if template supports it
      if (processed.items && template.features?.skillCategories) {
        processed.categorizedItems = groupSkillsByCategory(processed.items);
      }
      break;
  }

  return processed;
}

function groupSkillsByCategory(skills: any[]) {
  const categories: { [key: string]: any[] } = {};
  
  skills.forEach((skill) => {
    const category = skill.category || "Other";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(skill);
  });

  return Object.entries(categories).map(([name, items]) => ({
    name,
    items,
  }));
}

function generateCSSVariables(themeConfig: any) {
  const variables: { [key: string]: string } = {};

  // Color variables
  if (themeConfig.colors) {
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      variables[`--color-${key}`] = value as string;
    });
  }

  // Font variables
  if (themeConfig.fonts) {
    Object.entries(themeConfig.fonts).forEach(([key, value]) => {
      variables[`--font-${key}`] = value as string;
    });
  }

  // Spacing and layout variables
  if (themeConfig.spacing) {
    Object.entries(themeConfig.spacing).forEach(([key, value]) => {
      variables[`--spacing-${key}`] = value as string;
    });
  }

  return variables;
}