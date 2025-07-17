"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
      variant: {
        default: "bg-secondary",
        success: "bg-green-100 dark:bg-green-900/20",
        warning: "bg-yellow-100 dark:bg-yellow-900/20",
        destructive: "bg-red-100 dark:bg-red-900/20",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        destructive: "bg-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ 
  className, 
  value = 0, 
  max = 100, 
  size, 
  variant, 
  showValue = false,
  formatValue = (val, maximum) => `${Math.round((val / maximum) * 100)}%`,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        className={cn(progressVariants({ size, variant }), className)}
        value={value}
        max={max}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(progressIndicatorVariants({ variant }))}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {formatValue(value, max)}
        </div>
      )}
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressVariants };