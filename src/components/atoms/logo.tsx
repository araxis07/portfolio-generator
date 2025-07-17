import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const logoVariants = cva(
  "font-bold tracking-tight select-none transition-colors",
  {
    variants: {
      size: {
        sm: "text-lg",
        default: "text-xl",
        lg: "text-2xl",
        xl: "text-3xl",
        "2xl": "text-4xl",
      },
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        gradient: "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

export interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {
  text?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
  href?: string;
  as?: "div" | "h1" | "h2" | "span";
}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ 
    className, 
    size, 
    variant, 
    text = "Portfolio", 
    showIcon = true, 
    icon,
    href,
    as: Component = "div",
    ...props 
  }, ref) => {
    const logoContent = (
      <Component
        ref={ref}
        data-slot="logo"
        className={cn(logoVariants({ size, variant }), "flex items-center gap-2", className)}
        {...props}
      >
        {showIcon && (
          <div className="flex-shrink-0">
            {icon || (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {text.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}
        <span>{text}</span>
      </Component>
    );

    if (href) {
      return (
        <a 
          href={href}
          className="inline-block hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
        >
          {logoContent}
        </a>
      );
    }

    return logoContent;
  }
);
Logo.displayName = "Logo";

// Preset logo variants for common use cases
const LogoBrand = (props: Omit<LogoProps, "variant">) => (
  <Logo variant="primary" {...props} />
);

const LogoGradient = (props: Omit<LogoProps, "variant">) => (
  <Logo variant="gradient" {...props} />
);

const LogoMuted = (props: Omit<LogoProps, "variant">) => (
  <Logo variant="muted" {...props} />
);

export { Logo, LogoBrand, LogoGradient, LogoMuted, logoVariants };