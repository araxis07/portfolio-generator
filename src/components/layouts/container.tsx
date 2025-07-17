"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva(
  "w-full mx-auto px-4 sm:px-6 lg:px-8",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
        screen: "max-w-screen-2xl",
      },
      padding: {
        none: "px-0",
        sm: "px-2 sm:px-4 lg:px-6",
        md: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
        xl: "px-8 sm:px-12 lg:px-16",
      },
      centered: {
        true: "text-center",
        false: "",
      },
    },
    defaultVariants: {
      size: "7xl",
      padding: "md",
      centered: false,
    },
  }
);

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: "div" | "section" | "article" | "main" | "header" | "footer" | "aside";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, centered, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, padding, centered }), className)}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";

// Preset container variants for common use cases
export const ContainerFluid = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, "size">
>((props, ref) => <Container ref={ref} size="full" {...props} />);

ContainerFluid.displayName = "ContainerFluid";

export const ContainerNarrow = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, "size">
>((props, ref) => <Container ref={ref} size="4xl" {...props} />);

ContainerNarrow.displayName = "ContainerNarrow";

export const ContainerWide = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, "size">
>((props, ref) => <Container ref={ref} size="screen" {...props} />);

ContainerWide.displayName = "ContainerWide";

export type { ContainerProps };