import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "bg-muted",
        card: "bg-card border",
        text: "bg-muted/60",
        avatar: "rounded-full bg-muted",
        button: "bg-muted/80",
      },
      size: {
        sm: "h-4",
        default: "h-4",
        lg: "h-6",
        xl: "h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  lines?: number;
  spacing?: string;
}

function Skeleton({ 
  className, 
  variant, 
  size, 
  width, 
  height, 
  circle = false,
  lines = 1,
  spacing = "0.5rem",
  style,
  ...props 
}: SkeletonProps) {
  const skeletonStyle = {
    width,
    height,
    ...style,
  };

  if (circle) {
    const dimension = width || height || "2.5rem";
    skeletonStyle.width = dimension;
    skeletonStyle.height = dimension;
  }

  if (lines === 1) {
    return (
      <div
        data-slot="skeleton"
        className={cn(
          skeletonVariants({ variant: circle ? "avatar" : variant, size }),
          circle && "rounded-full",
          className
        )}
        style={skeletonStyle}
        {...props}
      />
    );
  }

  return (
    <div className="space-y-2" style={{ gap: spacing }}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          data-slot="skeleton"
          className={cn(
            skeletonVariants({ variant, size }),
            index === lines - 1 && "w-3/4", // Last line is shorter
            className
          )}
          style={index === lines - 1 ? { ...skeletonStyle, width: "75%" } : skeletonStyle}
          {...props}
        />
      ))}
    </div>
  );
}

// Preset skeleton components for common use cases
const SkeletonText = ({ lines = 3, className, ...props }: Omit<SkeletonProps, "variant">) => (
  <Skeleton variant="text" lines={lines} className={className} {...props} />
);

const SkeletonAvatar = ({ size = "2.5rem", className, ...props }: Omit<SkeletonProps, "variant" | "circle" | "size"> & { size?: string | number }) => (
  <Skeleton variant="avatar" circle width={size} height={size} className={className} {...props} />
);

const SkeletonButton = ({ width = "5rem", className, ...props }: Omit<SkeletonProps, "variant">) => (
  <Skeleton variant="button" width={width} height="2.25rem" className={className} {...props} />
);

const SkeletonCard = ({ className, children, ...props }: Omit<SkeletonProps, "variant">) => (
  <div
    data-slot="skeleton-card"
    className={cn(
      "animate-pulse rounded-lg border bg-card p-6 shadow-sm",
      className
    )}
    {...props}
  >
    {children || (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <SkeletonAvatar />
          <div className="space-y-2 flex-1">
            <Skeleton height="1rem" width="40%" />
            <Skeleton height="0.875rem" width="60%" variant="text" />
          </div>
        </div>
        <SkeletonText lines={2} />
      </div>
    )}
  </div>
);

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton, 
  SkeletonCard,
  skeletonVariants 
};