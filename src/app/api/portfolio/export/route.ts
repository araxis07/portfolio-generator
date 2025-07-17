import { type NextRequest, NextResponse } from "next/server";
import { portfolioStorage } from "@/lib/storage";
import { portfolioTemplates } from "@/data/templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { portfolioId, format = "html", options = {} } = body;

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
      (t) => t.id === portfolio.theme.id
    );
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Validate portfolio before export
    const validation = await validateForExport(portfolio);
    if (!validation.canExport) {
      return NextResponse.json(
        { 
          error: "Portfolio validation failed",
          validation 
        },
        { status: 400 }
      );
    }

    // Prepare export based on format
    let exportData;
    switch (format) {
      case "html":
        exportData = await prepareHTMLExport(portfolio, template, options);
        break;
      case "pdf":
        exportData = await preparePDFExport(portfolio, template, options);
        break;
      case "json":
        exportData = await prepareJSONExport(portfolio, options);
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported export format" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: exportData,
      validation,
    });
  } catch (error) {
    console.error("Export preparation error:", error);
    return NextResponse.json(
      { error: "Failed to prepare export" },
      { status: 500 }
    );
  }
}

async function validateForExport(portfolio: any) {
  const validation = {
    canExport: true,
    issues: [] as string[],
    warnings: [] as string[],
    completeness: 0,
  };

  // Check required sections
  const requiredSections = ["hero", "about"];
  const existingSectionTypes = portfolio.sections.map((s: any) => s.type);
  
  requiredSections.forEach((required) => {
    if (!existingSectionTypes.includes(required)) {
      validation.issues.push(`Missing required section: ${required}`);
      validation.canExport = false;
    }
  });

  // Check hero section content
  const heroSection = portfolio.sections.find((s: any) => s.type === "hero");
  if (heroSection) {
    if (!heroSection.content?.name) {
      validation.issues.push("Name is required in hero section");
      validation.canExport = false;
    }
    if (!heroSection.content?.title) {
      validation.issues.push("Professional title is required in hero section");
      validation.canExport = false;
    }
  }

  // Check about section content
  const aboutSection = portfolio.sections.find((s: any) => s.type === "about");
  if (aboutSection) {
    if (!aboutSection.content?.bio) {
      validation.issues.push("Bio/description is required in about section");
      validation.canExport = false;
    }
  }

  // Check contact information
  const contactSection = portfolio.sections.find((s: any) => s.type === "contact");
  if (contactSection) {
    if (!contactSection.content?.email) {
      validation.warnings.push("Email address is recommended for contact");
    }
  } else {
    validation.warnings.push("Contact section is recommended");
  }

  // Calculate completeness
  const totalSections = portfolio.sections.length;
  const completeSections = portfolio.sections.filter((s: any) => 
    s.isVisible && s.content && Object.keys(s.content).length > 0
  ).length;
  
  validation.completeness = totalSections > 0 ? Math.round((completeSections / totalSections) * 100) : 0;

  // Additional warnings
  if (!portfolio.settings.seoTitle) {
    validation.warnings.push("SEO title not set - recommended for web export");
  }
  if (!portfolio.settings.seoDescription) {
    validation.warnings.push("SEO description not set - recommended for web export");
  }

  return validation;
}

async function prepareHTMLExport(portfolio: any, template: any, options: any) {
  const exportOptions = {
    includeAssets: options.includeAssets ?? true,
    minify: options.minify ?? false,
    standalone: options.standalone ?? true,
    customDomain: options.customDomain,
    ...options,
  };

  // Generate the complete HTML
  const htmlUrl = `/api/preview/${portfolio.id}?template=${template.id}`;
  
  // Prepare asset list
  const assets = [];
  if (exportOptions.includeAssets) {
    // Add fonts
    assets.push({
      type: "font",
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      local: false,
    });
    
    // Add any custom assets from portfolio
    if (portfolio.sections) {
      portfolio.sections.forEach((section: any) => {
        if (section.content?.avatar) {
          assets.push({
            type: "image",
            url: section.content.avatar,
            local: true,
          });
        }
        if (section.type === "projects" && section.content?.items) {
          section.content.items.forEach((project: any) => {
            if (project.image) {
              assets.push({
                type: "image",
                url: project.image,
                local: true,
              });
            }
          });
        }
      });
    }
  }

  return {
    format: "html",
    htmlUrl,
    assets,
    options: exportOptions,
    filename: `${portfolio.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_portfolio.html`,
    size: "estimated", // Would calculate actual size in real implementation
  };
}

async function preparePDFExport(portfolio: any, template: any, options: any) {
  const exportOptions = {
    format: options.format ?? "A4",
    orientation: options.orientation ?? "portrait",
    margins: options.margins ?? { top: 20, right: 20, bottom: 20, left: 20 },
    includeImages: options.includeImages ?? true,
    quality: options.quality ?? "high",
    ...options,
  };

  return {
    format: "pdf",
    sourceUrl: `/api/preview/${portfolio.id}?template=${template.id}`,
    options: exportOptions,
    filename: `${portfolio.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_portfolio.pdf`,
    estimatedSize: "2-5 MB", // Would calculate based on content
  };
}

async function prepareJSONExport(portfolio: any, options: any) {
  const exportOptions = {
    includeMetadata: options.includeMetadata ?? true,
    includeSettings: options.includeSettings ?? false,
    format: options.format ?? "pretty",
    ...options,
  };

  // Prepare clean portfolio data
  const exportData = {
    ...portfolio,
  };

  // Remove sensitive data if not including settings
  if (!exportOptions.includeSettings) {
    delete exportData.settings.analytics;
    delete exportData.id;
    delete exportData.createdAt;
    delete exportData.updatedAt;
  }

  // Add metadata if requested
  if (exportOptions.includeMetadata) {
    exportData.exportMetadata = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      format: "portfolio-generator-json",
    };
  }

  return {
    format: "json",
    data: exportData,
    options: exportOptions,
    filename: `${portfolio.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_portfolio.json`,
    size: JSON.stringify(exportData).length,
  };
}