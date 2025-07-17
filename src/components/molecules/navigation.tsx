import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/atoms/link";
import { Logo } from "@/components/atoms/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationVariants = cva(
  "flex items-center justify-between w-full",
  {
    variants: {
      variant: {
        default: "bg-background border-b border-border",
        transparent: "bg-transparent",
        filled: "bg-card shadow-sm",
        floating: "bg-card/80 backdrop-blur-sm rounded-lg shadow-lg mx-4 mt-4",
      },
      size: {
        sm: "h-12 px-4",
        default: "h-16 px-6",
        lg: "h-20 px-8",
      },
      sticky: {
        true: "sticky top-0 z-40",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      sticky: true,
    },
  }
);

const navItemVariants = cva(
  "relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-primary hover:bg-accent",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-accent",
        underline: "text-foreground hover:text-primary border-b-2 border-transparent hover:border-primary rounded-none px-0 py-3",
        pill: "text-foreground hover:text-primary-foreground hover:bg-primary rounded-full",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        active: true,
        class: "text-primary bg-accent",
      },
      {
        variant: "ghost",
        active: true,
        class: "text-foreground bg-accent",
      },
      {
        variant: "underline",
        active: true,
        class: "text-primary border-primary",
      },
      {
        variant: "pill",
        active: true,
        class: "text-primary-foreground bg-primary",
      },
    ],
    defaultVariants: {
      variant: "default",
      active: false,
    },
  }
);

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  external?: boolean;
  children?: NavItem[];
}

export interface NavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navigationVariants> {
  logo?: React.ReactNode;
  items: NavItem[];
  actions?: React.ReactNode;
  itemVariant?: VariantProps<typeof navItemVariants>["variant"];
  mobileBreakpoint?: "sm" | "md" | "lg";
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({
    className,
    variant,
    size,
    sticky,
    logo,
    items,
    actions,
    itemVariant = "default",
    mobileBreakpoint = "md",
    ...props
  }, ref) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const breakpointClass = {
      sm: "sm:hidden",
      md: "md:hidden",
      lg: "lg:hidden",
    }[mobileBreakpoint];

    const showDesktopClass = {
      sm: "sm:flex",
      md: "md:flex",
      lg: "lg:flex",
    }[mobileBreakpoint];

    return (
      <nav
        ref={ref}
        data-slot="navigation"
        className={cn(navigationVariants({ variant, size, sticky }), className)}
        {...props}
      >
        {/* Logo */}
        <div className="flex items-center">
          {logo || <Logo />}
        </div>

        {/* Desktop Navigation */}
        <div className={cn("hidden items-center space-x-1", showDesktopClass)}>
          {items.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
              variant={itemVariant}
            />
          ))}
        </div>

        {/* Actions and Mobile Menu */}
        <div className="flex items-center gap-2">
          {actions}
          
          {/* Mobile Menu Button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("p-2", breakpointClass)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {items.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    onClose={() => setMobileOpen(false)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    );
  }
);
Navigation.displayName = "Navigation";

// Desktop Navigation Item Component
interface NavItemComponentProps {
  item: NavItem;
  variant: VariantProps<typeof navItemVariants>["variant"];
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({ item, variant }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  if (item.children && item.children.length > 0) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <button
          className={cn(
            navItemVariants({ variant, active: item.active }),
            "cursor-pointer"
          )}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          {item.label}
          <ChevronDown className="h-3 w-3 transition-transform duration-200" />
        </button>
        
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
            <div className="py-1">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  external={child.external}
                  className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      external={item.external}
      className={cn(navItemVariants({ variant, active: item.active }))}
    >
      {item.label}
    </Link>
  );
};

// Mobile Navigation Item Component
interface MobileNavItemProps {
  item: NavItem;
  onClose: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ item, onClose }) => {
  const [expanded, setExpanded] = React.useState(false);

  if (item.children && item.children.length > 0) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full px-4 py-2 text-left text-foreground hover:bg-accent rounded-md"
          aria-expanded={expanded}
        >
          {item.label}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </button>
        {expanded && (
          <div className="ml-4 mt-2 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                external={child.external}
                onClick={onClose}
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      external={item.external}
      onClick={onClose}
      className={cn(
        "block px-4 py-2 text-foreground hover:bg-accent rounded-md",
        item.active && "bg-accent text-primary"
      )}
    >
      {item.label}
    </Link>
  );
};

export { Navigation, navigationVariants, navItemVariants };