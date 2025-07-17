import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const loadingVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        spinner: "animate-spin",
        dots: "space-x-1",
        pulse: "animate-pulse",
        bounce: "space-x-1",
        bars: "space-x-1",
      },
      size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        default: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8",
        "2xl": "w-10 h-10",
      },
      colorScheme: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-500",
        warning: "text-yellow-500",
        info: "text-blue-500",
      },
    },
    defaultVariants: {
      variant: "spinner",
      size: "default",
      colorScheme: "primary",
    },
  }
);

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string;
  overlay?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({
    className,
    variant,
    size,
    colorScheme,
    text,
    overlay = false,
    ...props
  }, ref) => {
    const loadingContent = (
      <div
        ref={ref}
        data-slot="loading"
        className={cn(
          loadingVariants({ variant, size, colorScheme }),
          text && "flex-col gap-2",
          className
        )}
        role="status"
        aria-label={text || "Loading"}
        {...props}
      >
        {renderLoadingIcon(variant, size)}
        {text && (
          <span className="text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );

    if (overlay) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          {loadingContent}
        </div>
      );
    }

    return loadingContent;
  }
);
Loading.displayName = "Loading";

// Helper function to render different loading icons
function renderLoadingIcon(variant: LoadingProps["variant"], size: LoadingProps["size"]) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
    "2xl": "w-10 h-10",
  };

  const sizeClass = sizeClasses[size || "default"];

  switch (variant) {
    case "spinner":
      return (
        <svg
          className={cn("animate-spin", sizeClass)}
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

    case "dots":
      return (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-current animate-pulse",
                size === "xs" && "w-1 h-1",
                size === "sm" && "w-1.5 h-1.5",
                size === "default" && "w-2 h-2",
                size === "lg" && "w-2.5 h-2.5",
                size === "xl" && "w-3 h-3",
                size === "2xl" && "w-4 h-4"
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.4s",
              }}
            />
          ))}
        </div>
      );

    case "pulse":
      return (
        <div
          className={cn(
            "rounded-full bg-current animate-pulse",
            sizeClass
          )}
        />
      );

    case "bounce":
      return (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-current animate-bounce",
                size === "xs" && "w-1 h-1",
                size === "sm" && "w-1.5 h-1.5",
                size === "default" && "w-2 h-2",
                size === "lg" && "w-2.5 h-2.5",
                size === "xl" && "w-3 h-3",
                size === "2xl" && "w-4 h-4"
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      );

    case "bars":
      return (
        <div className="flex space-x-1 items-end">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-current animate-pulse",
                size === "xs" && "w-0.5",
                size === "sm" && "w-0.5",
                size === "default" && "w-1",
                size === "lg" && "w-1",
                size === "xl" && "w-1.5",
                size === "2xl" && "w-2"
              )}
              style={{
                height: `${20 + i * 10}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      );

    default:
      return null;
  }
}

// Preset loading components for common use cases
const LoadingSpinner = (props: Omit<LoadingProps, "variant">) => (
  <Loading variant="spinner" {...props} />
);

const LoadingDots = (props: Omit<LoadingProps, "variant">) => (
  <Loading variant="dots" {...props} />
);

const LoadingPulse = (props: Omit<LoadingProps, "variant">) => (
  <Loading variant="pulse" {...props} />
);

const LoadingBounce = (props: Omit<LoadingProps, "variant">) => (
  <Loading variant="bounce" {...props} />
);

const LoadingBars = (props: Omit<LoadingProps, "variant">) => (
  <Loading variant="bars" {...props} />
);

const LoadingOverlay = (props: Omit<LoadingProps, "overlay">) => (
  <Loading overlay {...props} />
);

export {
  Loading,
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  LoadingBounce,
  LoadingBars,
  LoadingOverlay,
  loadingVariants,
};