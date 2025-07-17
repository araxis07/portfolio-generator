import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Sun, Moon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Navigation, type NavItem } from "@/components/molecules/navigation";
import { Logo } from "@/components/atoms/logo";
import { Search } from "@/components/molecules/search";
import { SocialLinks, type SocialLink } from "@/components/molecules/social-links";
import { useTheme } from "@/providers/theme-provider";

const headerVariants = cva(
  "w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  {
    variants: {
      variant: {
        default: "sticky top-0 z-50",
        fixed: "fixed top-0 left-0 right-0 z-50",
        static: "relative",
        floating: "sticky top-4 z-50 mx-4 rounded-lg border shadow-lg",
      },
      size: {
        sm: "h-14",
        default: "h-16",
        lg: "h-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const headerContentVariants = cva(
  "flex items-center justify-between w-full",
  {
    variants: {
      size: {
        sm: "px-4 h-14",
        default: "px-6 h-16",
        lg: "px-8 h-20",
      },
      maxWidth: {
        none: "",
        sm: "max-w-screen-sm mx-auto",
        md: "max-w-screen-md mx-auto",
        lg: "max-w-screen-lg mx-auto",
        xl: "max-w-screen-xl mx-auto",
        "2xl": "max-w-screen-2xl mx-auto",
        full: "max-w-full mx-auto",
      },
    },
    defaultVariants: {
      size: "default",
      maxWidth: "xl",
    },
  }
);

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  logo?: React.ReactNode;
  navigation?: NavItem[];
  actions?: React.ReactNode;
  showSearch?: boolean;
  showThemeToggle?: boolean;
  showSocialLinks?: boolean;
  socialLinks?: SocialLink[];
  maxWidth?: VariantProps<typeof headerContentVariants>["maxWidth"];
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({
    className,
    variant,
    size,
    logo,
    navigation = [],
    actions,
    showSearch = false,
    showThemeToggle = true,
    showSocialLinks = false,
    socialLinks = [],
    maxWidth = "xl",
    onSearch,
    searchPlaceholder = "Search...",
    ...props
  }, ref) => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
      <header
        ref={ref}
        data-slot="header"
        className={cn(headerVariants({ variant, size }), className)}
        {...props}
      >
        <div className={cn(headerContentVariants({ size, maxWidth }))}>
          {/* Left Section - Logo */}
          <div className="flex items-center">
            {logo || <Logo />}
          </div>

          {/* Center Section - Navigation & Search */}
          <div className="flex items-center gap-6 flex-1 justify-center">
            {/* Desktop Navigation */}
            {navigation.length > 0 && (
              <div className="hidden md:block">
                <Navigation
                  items={navigation}
                  variant="transparent"
                  size="sm"
                  itemVariant="ghost"
                />
              </div>
            )}

            {/* Search */}
            {showSearch && (
              <div className="hidden sm:block max-w-sm w-full">
                <Search
                  variant="compact"
                  placeholder={searchPlaceholder}
                  onSearch={onSearch}
                />
              </div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* Social Links */}
            {showSocialLinks && socialLinks.length > 0 && (
              <div className="hidden lg:block">
                <SocialLinks
                  links={socialLinks}
                  variant="compact"
                  size="sm"
                  styleVariant="icons"
                  showTooltips
                />
              </div>
            )}

            {/* Theme Toggle */}
            {showThemeToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 p-0"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            )}

            {/* Custom Actions */}
            {actions}

            {/* Mobile Menu */}
            {navigation.length > 0 && (
              <div className="md:hidden">
                <Navigation
                  items={navigation}
                  variant="transparent"
                  size="sm"
                  mobileBreakpoint="md"
                />
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }
);
Header.displayName = "Header";

// Preset header components
const SimpleHeader = React.forwardRef<HTMLElement, Omit<HeaderProps, "showSearch" | "showSocialLinks">>(
  ({ ...props }, ref) => (
    <Header
      ref={ref}
      showSearch={false}
      showSocialLinks={false}
      {...props}
    />
  )
);
SimpleHeader.displayName = "SimpleHeader";

const FullHeader = React.forwardRef<HTMLElement, Omit<HeaderProps, "showSearch" | "showSocialLinks">>(
  ({ ...props }, ref) => (
    <Header
      ref={ref}
      showSearch
      showSocialLinks
      {...props}
    />
  )
);
FullHeader.displayName = "FullHeader";

const FloatingHeader = React.forwardRef<HTMLElement, Omit<HeaderProps, "variant">>(
  ({ ...props }, ref) => (
    <Header ref={ref} variant="floating" {...props} />
  )
);
FloatingHeader.displayName = "FloatingHeader";

const StaticHeader = React.forwardRef<HTMLElement, Omit<HeaderProps, "variant">>(
  ({ ...props }, ref) => (
    <Header ref={ref} variant="static" {...props} />
  )
);
StaticHeader.displayName = "StaticHeader";

export {
  Header,
  SimpleHeader,
  FullHeader,
  FloatingHeader,
  StaticHeader,
  headerVariants,
  headerContentVariants,
};