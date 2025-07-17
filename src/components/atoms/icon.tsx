import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const iconVariants = cva(
  "inline-flex items-center justify-center transition-colors",
  {
    variants: {
      size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        default: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
        "2xl": "w-10 h-10",
      },
      variant: {
        default: "text-current",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-500",
        warning: "text-yellow-500",
        info: "text-blue-500",
      },
      background: {
        none: "",
        subtle: "bg-muted rounded-md p-1",
        primary: "bg-primary text-primary-foreground rounded-md p-1",
        secondary: "bg-secondary text-secondary-foreground rounded-md p-1",
        destructive: "bg-destructive text-destructive-foreground rounded-md p-1",
        success: "bg-green-500 text-white rounded-md p-1",
        warning: "bg-yellow-500 text-white rounded-md p-1",
        info: "bg-blue-500 text-white rounded-md p-1",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      background: "none",
    },
  }
);

export interface IconProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  label?: string;
  loading?: boolean;
  spin?: boolean;
}

const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  ({ 
    className, 
    size, 
    variant, 
    background, 
    icon: IconComponent, 
    label,
    loading = false,
    spin = false,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="icon"
        className={cn(
          iconVariants({ size, variant, background }),
          (loading || spin) && "animate-spin",
          className
        )}
        aria-label={label}
        {...props}
      >
        <IconComponent 
          className={cn(
            "w-full h-full",
            background !== "none" && "w-4 h-4" // Adjust icon size when background is present
          )} 
        />
      </div>
    );
  }
);
Icon.displayName = "Icon";

// Preset icon variants for common use cases
const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & 
  Pick<IconProps, "icon" | "size" | "variant" | "label">
>(({ className, icon, size = "default", variant = "default", label, ...props }, ref) => (
  <button
    ref={ref}
    data-slot="icon-button"
    className={cn(
      "inline-flex items-center justify-center rounded-md transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      iconVariants({ size, variant, background: "none" }),
      "p-2", // Add padding for button
      className
    )}
    aria-label={label}
    {...props}
  >
    <Icon icon={icon} size={size} variant={variant} />
  </button>
));
IconButton.displayName = "IconButton";

// Loading spinner component
const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  Omit<IconProps, "icon" | "loading" | "spin">
>(({ className, size = "default", variant = "muted", ...props }, ref) => {
  const SpinnerIcon = () => (
    <svg
      className="w-full h-full animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div
      ref={ref}
      data-slot="loading-spinner"
      className={cn(iconVariants({ size, variant, background: "none" }), className)}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <SpinnerIcon />
    </div>
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

export { Icon, IconButton, LoadingSpinner, iconVariants };