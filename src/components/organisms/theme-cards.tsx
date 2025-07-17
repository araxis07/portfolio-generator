"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/typography";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/providers/theme-provider";
import {
  Check,
  Palette,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Zap,
  Heart,
  Star,
} from "lucide-react";

const themeCardVariants = cva(
  "relative p-6 border rounded-lg transition-all duration-200 cursor-pointer group hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-border bg-card hover:border-primary/50",
        selected: "border-primary bg-primary/5 ring-2 ring-primary/20",
        preview: "border-border bg-card hover:scale-105",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface ThemeOption {
  id: string;
  name: string;
  description?: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  popular?: boolean;
  new?: boolean;
}

interface ThemeCardProps extends VariantProps<typeof themeCardVariants> {
  theme: ThemeOption;
  selected?: boolean;
  onSelect?: (themeId: string) => void;
  showPreview?: boolean;
  className?: string;
}

const ThemeCard = React.forwardRef<HTMLDivElement, ThemeCardProps>(
  (
    {
      theme,
      selected = false,
      onSelect,
      showPreview = true,
      variant,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const IconComponent = theme.icon || Palette;

    return (
      <div
        ref={ref}
        className={cn(
          themeCardVariants({
            variant: selected ? "selected" : variant,
            size,
          }),
          className
        )}
        onClick={() => onSelect?.(theme.id)}
        role="button"
        tabIndex={0}
        {...(selected && { "aria-pressed": "true" })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(theme.id);
          }
        }}
        {...props}
      >
        {/* Selection Indicator */}
        {selected && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1">
          {theme.new && (
            <Badge variant="default" className="text-xs">
              New
            </Badge>
          )}
          {theme.popular && (
            <Badge variant="secondary" className="text-xs">
              Popular
            </Badge>
          )}
          {theme.badge && (
            <Badge variant="outline" className="text-xs">
              {theme.badge}
            </Badge>
          )}
        </div>

        {/* Theme Preview */}
        {showPreview && (
          <div className="mb-4 mt-6">
            <div className="flex gap-2 mb-3">
              {/* Color Swatches */}
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.preview.primary }}
                title="Primary Color"
              />
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.preview.secondary }}
                title="Secondary Color"
              />
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: theme.preview.accent }}
                title="Accent Color"
              />
            </div>

            {/* Mini Preview */}
            <div
              className="w-full h-16 rounded border overflow-hidden"
              style={{
                backgroundColor: theme.preview.background,
                color: theme.preview.foreground,
              }}
            >
              <div className="p-2 h-full flex flex-col justify-between">
                <div
                  className="h-2 rounded"
                  style={{ backgroundColor: theme.preview.primary, width: "60%" }}
                />
                <div className="flex gap-1">
                  <div
                    className="h-1.5 rounded"
                    style={{ backgroundColor: theme.preview.secondary, width: "40%" }}
                  />
                  <div
                    className="h-1.5 rounded"
                    style={{ backgroundColor: theme.preview.accent, width: "20%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theme Info */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Typography variant="h4" className="mb-1 truncate">
              {theme.name}
            </Typography>
            {theme.description && (
              <Typography variant="small" className="text-muted-foreground line-clamp-2">
                {theme.description}
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  }
);
ThemeCard.displayName = "ThemeCard";

interface ThemeCardsProps {
  themes: ThemeOption[];
  selectedTheme?: string;
  onThemeSelect?: (themeId: string) => void;
  columns?: 1 | 2 | 3 | 4;
  showPreview?: boolean;
  className?: string;
}

export const ThemeCards = React.forwardRef<HTMLDivElement, ThemeCardsProps>(
  (
    {
      themes,
      selectedTheme,
      onThemeSelect,
      columns = 3,
      showPreview = true,
      className,
      ...props
    },
    ref
  ) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    return (
      <div
        ref={ref}
        className={cn("grid gap-4", gridCols[columns], className)}
        {...props}
      >
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={selectedTheme === theme.id}
            onSelect={onThemeSelect}
            showPreview={showPreview}
          />
        ))}
      </div>
    );
  }
);
ThemeCards.displayName = "ThemeCards";

// Theme Mode Selector
interface ThemeModeProps {
  mode?: "light" | "dark" | "system";
  onModeChange?: (mode: "light" | "dark" | "system") => void;
  className?: string;
}

export const ThemeModeSelector = React.forwardRef<HTMLDivElement, ThemeModeProps>(
  ({ mode = "system", onModeChange, className, ...props }, ref) => {
    const modes = [
      {
        id: "light" as const,
        name: "Light",
        icon: Sun,
        description: "Light theme",
      },
      {
        id: "dark" as const,
        name: "Dark",
        icon: Moon,
        description: "Dark theme",
      },
      {
        id: "system" as const,
        name: "System",
        icon: Monitor,
        description: "Follow system preference",
      },
    ];

    return (
      <div ref={ref} className={cn("flex gap-2", className)} {...props}>
        {modes.map((modeOption) => {
          const IconComponent = modeOption.icon;
          const isSelected = mode === modeOption.id;

          return (
            <Button
              key={modeOption.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange?.(modeOption.id)}
              className="flex-1"
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {modeOption.name}
            </Button>
          );
        })}
      </div>
    );
  }
);
ThemeModeSelector.displayName = "ThemeModeSelector";

// Predefined themes
export const defaultThemes: ThemeOption[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and modern default theme",
    preview: {
      primary: "#0f172a",
      secondary: "#64748b",
      accent: "#3b82f6",
      background: "#ffffff",
      foreground: "#0f172a",
    },
    icon: Palette,
    popular: true,
  },
  {
    id: "blue",
    name: "Ocean Blue",
    description: "Calm and professional blue theme",
    preview: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#06b6d4",
      background: "#f8fafc",
      foreground: "#1e293b",
    },
    icon: Zap,
  },
  {
    id: "purple",
    name: "Royal Purple",
    description: "Creative and elegant purple theme",
    preview: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      accent: "#ec4899",
      background: "#faf5ff",
      foreground: "#581c87",
    },
    icon: Sparkles,
    new: true,
  },
  {
    id: "green",
    name: "Nature Green",
    description: "Fresh and organic green theme",
    preview: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#84cc16",
      background: "#f0fdf4",
      foreground: "#064e3b",
    },
    icon: Heart,
  },
  {
    id: "orange",
    name: "Sunset Orange",
    description: "Warm and energetic orange theme",
    preview: {
      primary: "#ea580c",
      secondary: "#f97316",
      accent: "#eab308",
      background: "#fffbeb",
      foreground: "#9a3412",
    },
    icon: Star,
  },
  {
    id: "dark",
    name: "Midnight Dark",
    description: "Sleek and modern dark theme",
    preview: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#06b6d4",
      background: "#0f172a",
      foreground: "#f1f5f9",
    },
    icon: Moon,
    popular: true,
  },
];

// Theme Provider Integration
export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h3" className="mb-2">
          Choose Theme Mode
        </Typography>
        <Typography variant="muted" className="mb-4">
          Select your preferred color scheme
        </Typography>
        <ThemeModeSelector
          mode={theme as "light" | "dark" | "system"}
          onModeChange={setTheme}
        />
      </div>

      <div>
        <Typography variant="h3" className="mb-2">
          Choose Color Theme
        </Typography>
        <Typography variant="muted" className="mb-4">
          Pick a color theme that matches your style
        </Typography>
        <ThemeCards
          themes={defaultThemes}
          selectedTheme="default"
          onThemeSelect={(themeId) => {
            console.log("Selected theme:", themeId);
            // Here you would implement theme switching logic
          }}
        />
      </div>
    </div>
  );
};

export type { ThemeOption, ThemeCardProps, ThemeCardsProps, ThemeModeProps };