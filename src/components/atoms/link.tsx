import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";

import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary/80 underline-offset-4 hover:underline",
        subtle: "text-foreground hover:text-primary underline-offset-4 hover:underline",
        ghost: "text-foreground hover:text-primary hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1",
        button: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2 font-medium shadow-sm",
        destructive: "text-destructive hover:text-destructive/80 underline-offset-4 hover:underline",
        muted: "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
      underline: {
        none: "no-underline hover:no-underline",
        hover: "no-underline hover:underline",
        always: "underline",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      underline: "hover",
    },
  }
);

export interface LinkProps
  extends Omit<React.ComponentProps<typeof NextLink>, "className">,
    VariantProps<typeof linkVariants> {
  className?: string;
  external?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const Link = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  LinkProps
>(({ 
  className, 
  variant, 
  size, 
  underline,
  external = false,
  showIcon = false,
  icon,
  disabled = false,
  children,
  href,
  ...props 
}, ref) => {
  // External link props
  const externalProps = external ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};

  // Default external link icon
  const defaultExternalIcon = (
    <svg
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );

  if (disabled) {
    return (
      <span
        className={cn(
          linkVariants({ variant, size, underline }),
          "cursor-not-allowed opacity-50",
          className
        )}
        aria-disabled="true"
      >
        {children}
        {(showIcon || external) && (
          <span className="ml-1">
            {icon || (external && defaultExternalIcon)}
          </span>
        )}
      </span>
    );
  }

  return (
    <NextLink
      ref={ref}
      href={href}
      data-slot="link"
      className={cn(linkVariants({ variant, size, underline }), className)}
      {...externalProps}
      {...props}
    >
      {children}
      {(showIcon || external) && (
        <span className="ml-1">
          {icon || (external && defaultExternalIcon)}
        </span>
      )}
    </NextLink>
  );
});
Link.displayName = "Link";

// Preset link components for common use cases
const ExternalLink = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  Omit<LinkProps, "external">
>(({ ...props }, ref) => (
  <Link ref={ref} external {...props} />
));
ExternalLink.displayName = "ExternalLink";

const ButtonLink = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  Omit<LinkProps, "variant">
>(({ ...props }, ref) => (
  <Link ref={ref} variant="button" {...props} />
));
ButtonLink.displayName = "ButtonLink";

const SubtleLink = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  Omit<LinkProps, "variant">
>(({ ...props }, ref) => (
  <Link ref={ref} variant="subtle" {...props} />
));
SubtleLink.displayName = "SubtleLink";

const GhostLink = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  Omit<LinkProps, "variant">
>(({ ...props }, ref) => (
  <Link ref={ref} variant="ghost" {...props} />
));
GhostLink.displayName = "GhostLink";

const MutedLink = React.forwardRef<
  React.ElementRef<typeof NextLink>,
  Omit<LinkProps, "variant">
>(({ ...props }, ref) => (
  <Link ref={ref} variant="muted" {...props} />
));
MutedLink.displayName = "MutedLink";

export {
  Link,
  ExternalLink,
  ButtonLink,
  SubtleLink,
  GhostLink,
  MutedLink,
  linkVariants,
};