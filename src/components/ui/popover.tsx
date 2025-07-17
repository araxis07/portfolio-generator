"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const popoverContentVariants = cva(
  "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      size: {
        sm: "w-56",
        default: "w-72",
        lg: "w-80",
        xl: "w-96",
        auto: "w-auto",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    VariantProps<typeof popoverContentVariants>
>(({ className, align = "center", sideOffset = 4, size, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      data-slot="popover-content"
      className={cn(popoverContentVariants({ size }), className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="popover-header"
    className={cn("mb-2 border-b border-border pb-2", className)}
    {...props}
  />
);
PopoverHeader.displayName = "PopoverHeader";

const PopoverTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    data-slot="popover-title"
    className={cn("font-medium leading-none", className)}
    {...props}
  />
);
PopoverTitle.displayName = "PopoverTitle";

const PopoverDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="popover-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
PopoverDescription.displayName = "PopoverDescription";

const PopoverFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="popover-footer"
    className={cn("mt-2 border-t border-border pt-2", className)}
    {...props}
  />
);
PopoverFooter.displayName = "PopoverFooter";

const PopoverClose = PopoverPrimitive.Close;

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverFooter,
  popoverContentVariants,
};