"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/atoms/logo";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/atoms/icon";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

const sidebarVariants = cva(
  "flex flex-col bg-background border-r border-border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "h-screen",
        floating: "h-[calc(100vh-2rem)] m-4 rounded-lg border shadow-lg",
        minimal: "h-screen border-r-0 shadow-sm",
      },
      size: {
        sm: "w-16",
        md: "w-64",
        lg: "w-80",
        xl: "w-96",
      },
      position: {
        left: "left-0",
        right: "right-0",
      },
      collapsible: {
        true: "transition-width",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "left",
      collapsible: false,
    },
  }
);

interface SidebarSection {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    badge?: string;
    active?: boolean;
    disabled?: boolean;
  }>;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface SidebarProps extends VariantProps<typeof sidebarVariants> {
  className?: string;
  children?: React.ReactNode;
  logo?: {
    text?: string;
    href?: string;
    icon?: React.ReactNode;
    showIcon?: boolean;
  };
  sections?: SidebarSection[];
  footer?: React.ReactNode;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showToggle?: boolean;
  mobileBreakpoint?: "sm" | "md" | "lg";
}

const SidebarItem = React.forwardRef<
  HTMLAnchorElement,
  {
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    badge?: string;
    active?: boolean;
    disabled?: boolean;
    isCollapsed?: boolean;
    onClick?: () => void;
  }
>(({ href, icon: IconComponent, children, badge, active, disabled, isCollapsed, onClick, ...props }, ref) => (
  <a
    ref={ref}
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active && "bg-accent text-accent-foreground font-medium",
      disabled && "opacity-50 cursor-not-allowed pointer-events-none",
      isCollapsed && "justify-center px-2"
    )}
    aria-current={active ? "page" : undefined}
    {...(disabled && { "aria-disabled": "true" })}
    {...props}
  >
    {IconComponent && (
      <IconComponent className={cn("h-4 w-4 flex-shrink-0", isCollapsed && "h-5 w-5")} />
    )}
    {!isCollapsed && (
      <>
        <span className="flex-1 truncate">{children}</span>
        {badge && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {badge}
          </Badge>
        )}
      </>
    )}
  </a>
));
SidebarItem.displayName = "SidebarItem";

const SidebarSection = React.forwardRef<
  HTMLDivElement,
  {
    title: string;
    children: React.ReactNode;
    collapsible?: boolean;
    defaultExpanded?: boolean;
    isCollapsed?: boolean;
  }
>(({ title, children, collapsible = false, defaultExpanded = true, isCollapsed, ...props }, ref) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  if (isCollapsed) {
    return (
      <div ref={ref} className="space-y-1" {...props}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-2" {...props}>
      {collapsible ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between px-3 py-1 h-auto font-medium text-xs text-muted-foreground hover:text-foreground"
        >
          <span className="uppercase tracking-wider">{title}</span>
          <Icon
            icon={isExpanded ? ChevronRight : ChevronLeft}
            className="h-3 w-3"
          />
        </Button>
      ) : (
        <Typography
          variant="small"
          className="px-3 py-1 font-medium text-muted-foreground uppercase tracking-wider"
        >
          {title}
        </Typography>
      )}
      {(!collapsible || isExpanded) && (
        <div className="space-y-1">{children}</div>
      )}
    </div>
  );
});
SidebarSection.displayName = "SidebarSection";

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      children,
      variant,
      size,
      position,
      collapsible,
      logo,
      sections = [],
      footer,
      isCollapsed = false,
      onToggleCollapse,
      showToggle = false,
      mobileBreakpoint = "md",
      ...props
    },
    ref
  ) => {
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const sidebarContent = (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {logo && !isCollapsed && (
            <Logo
              text={logo.text}
              href={logo.href}
              icon={logo.icon}
              showIcon={logo.showIcon}
              size="sm"
            />
          )}
          {logo && isCollapsed && (
            <Logo
              text={logo.text}
              href={logo.href}
              icon={logo.icon}
              showIcon={logo.showIcon !== false}
              size="sm"
            />
          )}
          {showToggle && onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1 h-auto"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Icon
                icon={isCollapsed ? ChevronRight : ChevronLeft}
                className="h-4 w-4"
              />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map((section) => (
            <SidebarSection
              key={section.id}
              title={section.title}
              collapsible={section.collapsible}
              defaultExpanded={section.defaultExpanded}
              isCollapsed={isCollapsed}
            >
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  href={item.href}
                  icon={item.icon}
                  badge={item.badge}
                  active={item.active}
                  disabled={item.disabled}
                  isCollapsed={isCollapsed}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </SidebarSection>
          ))}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <>
            <Separator />
            <div className="p-4">{footer}</div>
          </>
        )}
      </div>
    );

    return (
      <>
        {/* Mobile Trigger */}
        <div className={cn("md:hidden", mobileBreakpoint === "sm" && "sm:hidden", mobileBreakpoint === "lg" && "lg:hidden")}>
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={position}
              className="p-0 w-80"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                {logo && (
                  <Logo
                    text={logo.text}
                    href={logo.href}
                    icon={logo.icon}
                    showIcon={logo.showIcon}
                    size="sm"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 h-auto"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {sections.map((section) => (
                  <SidebarSection
                    key={section.id}
                    title={section.title}
                    collapsible={section.collapsible}
                    defaultExpanded={section.defaultExpanded}
                  >
                    {section.items.map((item) => (
                      <SidebarItem
                        key={item.id}
                        href={item.href}
                        icon={item.icon}
                        badge={item.badge}
                        active={item.active}
                        disabled={item.disabled}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {item.label}
                      </SidebarItem>
                    ))}
                  </SidebarSection>
                ))}
                {children}
              </div>
              {footer && (
                <>
                  <Separator />
                  <div className="p-4">{footer}</div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside
          ref={ref}
          className={cn(
            sidebarVariants({ variant, size: isCollapsed ? "sm" : size, position, collapsible }),
            "hidden md:flex",
            mobileBreakpoint === "sm" && "sm:flex",
            mobileBreakpoint === "lg" && "lg:flex",
            className
          )}
          {...props}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";

export type { SidebarProps, SidebarSection };