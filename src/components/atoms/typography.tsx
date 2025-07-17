import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      default: "leading-7",
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    textColor: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      info: "text-blue-600 dark:text-blue-400",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
  },
  defaultVariants: {
    variant: "default",
    align: "left",
    textColor: "default",
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  truncate?: boolean;
  gradient?: boolean;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    className, 
    variant, 
    align, 
    textColor, 
    weight,
    as,
    truncate = false,
    gradient = false,
    ...props 
  }, ref) => {
    // Determine the HTML element to render
    const Component = as || getDefaultElement(variant);

    return (
      <Component
        ref={ref}
        data-slot="typography"
        className={cn(
          typographyVariants({ variant, align, textColor, weight }),
          truncate && "truncate",
          gradient && "bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent",
          className
        )}
        {...props}
      />
    );
  }
);
Typography.displayName = "Typography";

// Helper function to get default HTML element based on variant
function getDefaultElement(variant: TypographyProps["variant"]): React.ElementType {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "blockquote":
      return "blockquote";
    case "code":
      return "code";
    case "default":
    case "lead":
    case "large":
    case "small":
    case "muted":
    case "p":
    default:
      return "p";
  }
}

// Preset typography components for common use cases
const Heading = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, "variant"> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }
>(({ level = 1, ...props }, ref) => (
  <Typography
    ref={ref}
    variant={`h${level}` as TypographyProps["variant"]}
    {...props}
  />
));
Heading.displayName = "Heading";

const Text = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="p" {...props} />
);
Text.displayName = "Text";

const Lead = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="lead" {...props} />
);
Lead.displayName = "Lead";

const Muted = React.forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="muted" {...props} />
);
Muted.displayName = "Muted";

const Code = React.forwardRef<HTMLElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="code" {...props} />
);
Code.displayName = "Code";

const Blockquote = React.forwardRef<HTMLQuoteElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="blockquote" {...props} />
);
Blockquote.displayName = "Blockquote";

export {
  Typography,
  Heading,
  Text,
  Lead,
  Muted,
  Code,
  Blockquote,
  typographyVariants,
};