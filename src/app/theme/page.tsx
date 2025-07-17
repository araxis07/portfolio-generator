"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { PageWrapper } from "@/components/layouts/page-wrapper";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePortfolio } from "@/hooks/use-portfolio";
import { portfolioTemplates } from "@/data/templates";
import { TemplatePreview } from "@/components/templates/template-preview";
import type { 
  PortfolioTemplate, 
  TemplateFilter, 
  TemplateSortOption,
  TemplateCategory,
  PreviewMode 
} from "@/types/template";
import {
  Search,
  Grid3X3,
  List,
  Eye,
  Check,
  ArrowLeft,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  Star,
  Crown,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ThemePage = () => {
  const router = useRouter();
  const { portfolio, updatePortfolio } = usePortfolio();
  
  // State management
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPreview, setShowPreview] = useState(false);
  const [filter, setFilter] = useState<TemplateFilter>({});
  const [sortOption, setSortOption] = useState<TemplateSortOption>({
    field: "popularity",
    direction: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Template categories
  const categories: { id: TemplateCategory; name: string; count: number }[] = [
    { id: "modern", name: "Modern", count: 1 },
    { id: "creative", name: "Creative", count: 1 },
    { id: "developer", name: "Developer", count: 1 },
    { id: "minimal", name: "Minimal", count: 1 },
    { id: "academic", name: "Academic", count: 1 },
  ];

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    const filtered = portfolioTemplates.filter((template) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !template.name.toLowerCase().includes(query) &&
          !template.description.toLowerCase().includes(query) &&
          !template.features.some((feature) =>
            feature.toLowerCase().includes(query)
          )
        ) {
          return false;
        }
      }

      // Category filter
      if (filter.category && template.category !== filter.category) {
        return false;
      }

      // Features filter
      if (filter.features && filter.features.length > 0) {
        if (
          !filter.features.some((feature) =>
            template.features.includes(feature)
          )
        ) {
          return false;
        }
      }

      // Premium filter
      if (filter.isPremium !== undefined) {
        if (template.isPremium !== filter.isPremium) {
          return false;
        }
      }

      return true;
    });

    // Sort templates
    filtered.sort((a, b) => {
      const direction = sortOption.direction === "asc" ? 1 : -1;
      
      switch (sortOption.field) {
        case "name":
          return a.name.localeCompare(b.name) * direction;
        case "category":
          return a.category.localeCompare(b.category) * direction;
        case "newest":
          return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0) * direction;
        case "popularity":
        default:
          return ((a.isPopular ? 1 : 0) - (b.isPopular ? 1 : 0)) * direction;
      }
    });

    return filtered;
  }, [portfolioTemplates, searchQuery, filter, sortOption]);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowPreview(true);
  };

  // Handle template confirmation
  const handleUseTemplate = () => {
    if (!selectedTemplate) return;

    const template = portfolioTemplates.find((t) => t.id === selectedTemplate);
    if (!template) return;

    // Update portfolio with selected template
    if (portfolio) {
      updatePortfolio({
        theme: {
          id: template.id,
          name: template.name,
          colors: template.colorSchemes[0]?.colors || {
            primary: "#2563eb",
            secondary: "#64748b",
            accent: "#0ea5e9",
            background: "#ffffff",
            foreground: "#0f172a",
            muted: "#f1f5f9",
            border: "#e2e8f0",
          },
          fonts: {
            heading: template.config.typography.headingFont,
            body: template.config.typography.bodyFont,
            mono: template.config.typography.monoFont || "monospace",
          },
          spacing: {
            xs: "0.25rem",
            sm: "0.5rem",
            md: "1rem",
            lg: "1.5rem",
            xl: "2rem",
          },
          borderRadius: "0.5rem",
        },
      });
    }

    // Navigate to preview or next step
    router.push("/preview");
  };

  // Template card component
  const TemplateCard = ({ template }: { template: PortfolioTemplate }) => (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg",
        selectedTemplate === template.id && "ring-2 ring-primary"
      )}
      onClick={() => handleTemplateSelect(template.id)}
    >
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Typography variant="h4" className="truncate">
                {template.name}
              </Typography>
              {template.isNew && (
                <Badge variant="default" className="text-xs">
                  New
                </Badge>
              )}
              {template.isPopular && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              {template.isPremium && (
                <Badge variant="outline" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            <Typography variant="small" className="text-muted-foreground mb-3">
              {template.description}
            </Typography>
            <Badge variant="outline" className="text-xs capitalize">
              {template.category}
            </Badge>
          </div>
          {selectedTemplate === template.id && (
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Template Preview */}
        <div className="mb-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Palette className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <Typography variant="small" className="text-muted-foreground">
                  Template Preview
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Typography variant="small" className="font-medium">
            Features:
          </Typography>
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {template.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleTemplateSelect(template.id);
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTemplate(template.id);
              handleUseTemplate();
            }}
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <PageWrapper>
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Typography variant="h1" className="mb-2">
              Choose Your Portfolio Template
            </Typography>
            <Typography variant="large" className="text-muted-foreground max-w-2xl mx-auto">
              Select from our collection of professionally designed templates. 
              Each template is fully customizable and responsive.
            </Typography>
          </div>

          {/* Filters and Search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!filter.category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter({ ...filter, category: undefined })}
              >
                All Templates ({portfolioTemplates.length})
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={filter.category === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilter({
                      ...filter,
                      category: filter.category === category.id ? undefined : category.id,
                    })
                  }
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Typography variant="h3">
                {filteredTemplates.length} Template{filteredTemplates.length !== 1 ? "s" : ""} Found
              </Typography>
              
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <Typography variant="small" className="text-muted-foreground">
                  Sort by:
                </Typography>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const options: TemplateSortOption[] = [
                      { field: "popularity", direction: "desc" },
                      { field: "name", direction: "asc" },
                      { field: "category", direction: "asc" },
                      { field: "newest", direction: "desc" },
                    ];
                    const currentIndex = options.findIndex(
                      (opt) => opt.field === sortOption.field && opt.direction === sortOption.direction
                    );
                    const nextIndex = (currentIndex + 1) % options.length;
                    const nextOption = options[nextIndex];
                    if (nextOption) {
                      setSortOption(nextOption);
                    }
                  }}
                >
                  {sortOption.field === "popularity" && "Popular"}
                  {sortOption.field === "name" && "Name"}
                  {sortOption.field === "category" && "Category"}
                  {sortOption.field === "newest" && "Newest"}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Templates */}
            {filteredTemplates.length > 0 ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                )}
              >
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <Typography variant="h3" className="mb-2">
                  No templates found
                </Typography>
                <Typography variant="muted">
                  Try adjusting your search or filter criteria
                </Typography>
              </div>
            )}
          </div>

          {/* Preview Modal */}
          {showPreview && selectedTemplate && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-4">
                    <Typography variant="h3">
                      {portfolioTemplates.find((t) => t.id === selectedTemplate)?.name} Preview
                    </Typography>
                    
                    {/* Preview Mode Toggle */}
                    <div className="flex gap-1 bg-muted rounded-lg p-1">
                      <Button
                        variant={previewMode === "desktop" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewMode("desktop")}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={previewMode === "tablet" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewMode("tablet")}
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={previewMode === "mobile" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setPreviewMode("mobile")}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(false)}
                    >
                      Close
                    </Button>
                    <Button onClick={handleUseTemplate}>
                      Use This Template
                    </Button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-4 bg-muted overflow-auto max-h-[70vh]">
                  <div
                    className={cn(
                      "bg-background rounded-lg shadow-lg mx-auto transition-all duration-300 overflow-hidden",
                      previewMode === "desktop" && "max-w-full",
                      previewMode === "tablet" && "max-w-2xl",
                      previewMode === "mobile" && "max-w-sm"
                    )}
                  >
                    <TemplatePreview
                      templateId={selectedTemplate}
                      mode={previewMode}
                      customization={{
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
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t">
            <Button
              variant="outline"
              onClick={() => router.push("/profile")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            {selectedTemplate && (
              <Button onClick={handleUseTemplate}>
                Continue with Selected Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default ThemePage;