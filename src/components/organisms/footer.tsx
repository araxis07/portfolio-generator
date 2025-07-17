import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/atoms/logo";
import { Link } from "@/components/atoms/link";
import { Typography } from "@/components/atoms/typography";
import { SocialLinks, type SocialLink } from "@/components/molecules/social-links";

const footerVariants = cva(
  "w-full border-t border-border bg-background",
  {
    variants: {
      variant: {
        default: "py-8",
        compact: "py-4",
        extended: "py-12",
      },
      layout: {
        simple: "",
        columns: "",
        centered: "text-center",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "columns",
    },
  }
);

const footerContentVariants = cva(
  "w-full",
  {
    variants: {
      maxWidth: {
        none: "",
        sm: "max-w-screen-sm mx-auto",
        md: "max-w-screen-md mx-auto",
        lg: "max-w-screen-lg mx-auto",
        xl: "max-w-screen-xl mx-auto",
        "2xl": "max-w-screen-2xl mx-auto",
        full: "max-w-full mx-auto",
      },
      padding: {
        none: "",
        sm: "px-4",
        default: "px-6",
        lg: "px-8",
      },
    },
    defaultVariants: {
      maxWidth: "xl",
      padding: "default",
    },
  }
);

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
  logo?: React.ReactNode;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  copyright?: string;
  showSocialLinks?: boolean;
  maxWidth?: VariantProps<typeof footerContentVariants>["maxWidth"];
  padding?: VariantProps<typeof footerContentVariants>["padding"];
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({
    className,
    variant,
    layout,
    logo,
    description,
    sections = [],
    socialLinks = [],
    copyright,
    showSocialLinks = true,
    maxWidth = "xl",
    padding = "default",
    ...props
  }, ref) => {
    const currentYear = new Date().getFullYear();
    const defaultCopyright = `© ${currentYear} All rights reserved.`;

    if (layout === "simple") {
      return (
        <footer
          ref={ref}
          data-slot="footer"
          className={cn(footerVariants({ variant, layout }), className)}
          {...props}
        >
          <div className={cn(footerContentVariants({ maxWidth, padding }))}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {logo || <Logo size="sm" />}
                {description && (
                  <Typography variant="small" className="text-muted-foreground">
                    {description}
                  </Typography>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {showSocialLinks && socialLinks.length > 0 && (
                  <SocialLinks
                    links={socialLinks}
                    variant="compact"
                    size="sm"
                    styleVariant="icons"
                    showTooltips
                  />
                )}
                <Typography variant="small" className="text-muted-foreground">
                  {copyright || defaultCopyright}
                </Typography>
              </div>
            </div>
          </div>
        </footer>
      );
    }

    if (layout === "centered") {
      return (
        <footer
          ref={ref}
          data-slot="footer"
          className={cn(footerVariants({ variant, layout }), className)}
          {...props}
        >
          <div className={cn(footerContentVariants({ maxWidth, padding }))}>
            <div className="space-y-6">
              {/* Logo and Description */}
              <div className="space-y-4">
                {logo || <Logo className="mx-auto" />}
                {description && (
                  <Typography variant="p" className="text-muted-foreground max-w-md mx-auto">
                    {description}
                  </Typography>
                )}
              </div>

              {/* Social Links */}
              {showSocialLinks && socialLinks.length > 0 && (
                <div className="flex justify-center">
                  <SocialLinks
                    links={socialLinks}
                    variant="spaced"
                    size="default"
                    styleVariant="icons"
                    showTooltips
                  />
                </div>
              )}

              {/* Links */}
              {sections.length > 0 && (
                <div className="flex flex-wrap justify-center gap-6">
                  {sections.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <Typography variant="small" className="font-medium">
                        {section.title}
                      </Typography>
                      <div className="flex flex-col space-y-1">
                        {section.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            external={link.external}
                            variant="subtle"
                            className="text-sm"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Copyright */}
              <div className="pt-4 border-t border-border">
                <Typography variant="small" className="text-muted-foreground">
                  {copyright || defaultCopyright}
                </Typography>
              </div>
            </div>
          </div>
        </footer>
      );
    }

    // Default columns layout
    return (
      <footer
        ref={ref}
        data-slot="footer"
        className={cn(footerVariants({ variant, layout }), className)}
        {...props}
      >
        <div className={cn(footerContentVariants({ maxWidth, padding }))}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-2 space-y-4">
              {logo || <Logo />}
              {description && (
                <Typography variant="p" className="text-muted-foreground max-w-md">
                  {description}
                </Typography>
              )}
              {showSocialLinks && socialLinks.length > 0 && (
                <SocialLinks
                  links={socialLinks}
                  variant="default"
                  size="sm"
                  styleVariant="icons"
                  showTooltips
                />
              )}
            </div>

            {/* Link Sections */}
            {sections.map((section) => (
              <div key={section.title} className="space-y-4">
                <Typography variant="h6" className="font-semibold">
                  {section.title}
                </Typography>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      external={link.external}
                      variant="subtle"
                      className="block text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-border">
            <Typography variant="small" className="text-muted-foreground">
              {copyright || defaultCopyright}
            </Typography>
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = "Footer";

// Preset footer components
const SimpleFooter = React.forwardRef<HTMLElement, Omit<FooterProps, "layout">>(
  ({ ...props }, ref) => (
    <Footer ref={ref} layout="simple" {...props} />
  )
);
SimpleFooter.displayName = "SimpleFooter";

const CenteredFooter = React.forwardRef<HTMLElement, Omit<FooterProps, "layout">>(
  ({ ...props }, ref) => (
    <Footer ref={ref} layout="centered" {...props} />
  )
);
CenteredFooter.displayName = "CenteredFooter";

const CompactFooter = React.forwardRef<HTMLElement, Omit<FooterProps, "variant">>(
  ({ ...props }, ref) => (
    <Footer ref={ref} variant="compact" {...props} />
  )
);
CompactFooter.displayName = "CompactFooter";

const ExtendedFooter = React.forwardRef<HTMLElement, Omit<FooterProps, "variant">>(
  ({ ...props }, ref) => (
    <Footer ref={ref} variant="extended" {...props} />
  )
);
ExtendedFooter.displayName = "ExtendedFooter";

export {
  Footer,
  SimpleFooter,
  CenteredFooter,
  CompactFooter,
  ExtendedFooter,
  footerVariants,
  footerContentVariants,
};