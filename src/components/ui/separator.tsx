"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const separatorVariants = cva("shrink-0 bg-border", {
  variants: {
    orientation: {
      horizontal: "h-[1px] w-full",
      vertical: "h-full w-[1px]",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      size: "sm",
      className: "h-[0.5px]",
    },
    {
      orientation: "horizontal",
      size: "lg",
      className: "h-[2px]",
    },
    {
      orientation: "vertical",
      size: "sm",
      className: "w-[0.5px]",
    },
    {
      orientation: "vertical",
      size: "lg",
      className: "w-[2px]",
    },
  ],
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
  },
});

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> &
    VariantProps<typeof separatorVariants>
>(({ className, orientation = "horizontal", size, decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    data-slot="separator"
    className={cn(separatorVariants({ orientation, size }), className)}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator, separatorVariants };