"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/atoms/icon";
import { ArrowLeft, Home } from "lucide-react";

const pageWrapperVariants = cva(
  "min-h-screen bg-background",
  {
    variants: {
      variant: {
        default: "",
        centered: "flex items-center justify-center",
        fullscreen: "h-screen overflow-hidden",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
      },
      maxWidth: {
        none: "",
        sm: "max-w-sm mx-auto",
        md: "max-w-md mx-auto",
        lg: "max-w-lg mx-auto",
        xl: "max-w-xl mx-auto",
        "2xl": "max-w-2xl mx-auto",
        "3xl": "max-w-3xl mx-auto",
        "4xl": "max-w-4xl mx-auto",
        "5xl": "max-w-5xl mx-auto",
        "6xl": "max-w-6xl mx-auto",
        "7xl": "max-w-7xl mx-auto",
        full: "max-w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      maxWidth: "7xl",
    },
  }
);

const contentVariants = cva(
  "w-full",
  {
    variants: {
      spacing: {
        none: "",
        sm: "space-y-4",
        md: "space-y-6",
        lg: "space-y-8",
        xl: "space-y-12",
      },
    },
    defaultVariants: {
      spacing: "md",
    },
  }
);

interface Breadcrumb {
  label: string;
  href?: string;
  current?: boolean;
}

interface PageAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface PageWrapperProps extends VariantProps<typeof pageWrapperVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: PageAction[];
  backButton?: {
    href?: string;
    onClick?: () => void;
    label?: string;
  };
  spacing?: VariantProps<typeof contentVariants>["spacing"];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarPosition?: "left" | "right";
  sidebarWidth?: string;
}

const Breadcrumbs = React.forwardRef<
  HTMLElement,
  { breadcrumbs: Breadcrumb[]; className?: string }
>(({ breadcrumbs, className }, ref) => (
  <nav
    ref={ref}
    aria-label="Breadcrumb"
    className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
  >
    <Icon icon={Home} className="w-4 h-4" />
    {breadcrumbs.map((crumb, index) => (
      <React.Fragment key={index}>
        <span className="mx-2">/</span>
        {crumb.href && !crumb.current ? (
          <a
            href={crumb.href}
            className="hover:text-foreground transition-colors"
          >
            {crumb.label}
          </a>
        ) : (
          <span
            className={cn(
              crumb.current && "text-foreground font-medium"
            )}
            aria-current={crumb.current ? "page" : undefined}
          >
            {crumb.label}
          </span>
        )}
      </React.Fragment>
    ))}
  </nav>
));
Breadcrumbs.displayName = "Breadcrumbs";

const PageHeader = React.forwardRef<
  HTMLDivElement,
  {
    title?: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    actions?: PageAction[];
    backButton?: {
      href?: string;
      onClick?: () => void;
      label?: string;
    };
    className?: string;
  }
>(({ title, description, breadcrumbs, actions, backButton, className }, ref) => {
  if (!title && !description && !breadcrumbs && !actions && !backButton) {
    return null;
  }

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      )}

      {/* Back Button */}
      {backButton && (
        <div>
          {backButton.href ? (
            <a
              href={backButton.href}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon icon={ArrowLeft} className="w-4 h-4 mr-1" />
              {backButton.label || "Back"}
            </a>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={backButton.onClick}
              className="p-0 h-auto text-muted-foreground hover:text-foreground"
            >
              <Icon icon={ArrowLeft} className="w-4 h-4 mr-1" />
              {backButton.label || "Back"}
            </Button>
          )}
        </div>
      )}

      {/* Title and Actions */}
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && (
              <Typography variant="h1" className="mb-2">
                {title}
              </Typography>
            )}
            {description && (
              <Typography variant="muted" className="max-w-2xl">
                {description}
              </Typography>
            )}
          </div>

          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant || "default"}
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 mr-2" />
                    )}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
PageHeader.displayName = "PageHeader";

export const PageWrapper = React.forwardRef<HTMLDivElement, PageWrapperProps>(
  (
    {
      children,
      className,
      variant,
      padding,
      maxWidth,
      spacing,
      title,
      description,
      breadcrumbs,
      actions,
      backButton,
      header,
      footer,
      sidebar,
      sidebarPosition = "left",
      sidebarWidth = "280px",
      ...props
    },
    ref
  ) => {
    const hasPageHeader = title || description || breadcrumbs || actions || backButton;

    const content = (
      <div className={cn(contentVariants({ spacing }))}>
        {/* Custom Header */}
        {header}

        {/* Page Header */}
        {hasPageHeader && (
          <PageHeader
            title={title}
            description={description}
            breadcrumbs={breadcrumbs}
            actions={actions}
            backButton={backButton}
          />
        )}

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Custom Footer */}
        {footer}
      </div>
    );

    if (sidebar) {
      return (
        <div
          ref={ref}
          className={cn(pageWrapperVariants({ variant, padding: "none", maxWidth: "full" }), className)}
          {...props}
        >
          <div className="flex min-h-screen">
            {/* Left Sidebar */}
            {sidebarPosition === "left" && (
              <aside
                className="flex-shrink-0 border-r border-border"
                style={{ width: sidebarWidth }}
              >
                {sidebar}
              </aside>
            )}

            {/* Main Content */}
            <div className={cn("flex-1", pageWrapperVariants({ padding, maxWidth: "none" }))}>
              {content}
            </div>

            {/* Right Sidebar */}
            {sidebarPosition === "right" && (
              <aside
                className="flex-shrink-0 border-l border-border"
                style={{ width: sidebarWidth }}
              >
                {sidebar}
              </aside>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(pageWrapperVariants({ variant, padding, maxWidth }), className)}
        {...props}
      >
        {content}
      </div>
    );
  }
);

PageWrapper.displayName = "PageWrapper";

export type { PageWrapperProps, Breadcrumb, PageAction };