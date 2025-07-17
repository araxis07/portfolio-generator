import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Globe,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/atoms/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const socialLinksVariants = cva(
  "flex items-center",
  {
    variants: {
      variant: {
        default: "gap-2",
        compact: "gap-1",
        spaced: "gap-4",
        vertical: "flex-col gap-2",
      },
      size: {
        sm: "[&>*]:h-8 [&>*]:w-8",
        default: "[&>*]:h-10 [&>*]:w-10",
        lg: "[&>*]:h-12 [&>*]:w-12",
      },
      styleVariant: {
        buttons: "",
        links: "",
        icons: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      styleVariant: "buttons",
    },
  }
);

const socialItemVariants = cva(
  "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      styleVariant: {
        buttons: "rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        links: "text-muted-foreground hover:text-foreground",
        icons: "text-muted-foreground hover:text-foreground hover:bg-accent rounded-md",
      },
      size: {
        sm: "h-8 w-8 text-sm",
        default: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
      },
    },
    defaultVariants: {
      styleVariant: "buttons",
      size: "default",
    },
  }
);

// Social platform configurations
const socialPlatforms = {
  github: {
    name: "GitHub",
    icon: Github,
    color: "hover:text-gray-900 dark:hover:text-gray-100",
    baseUrl: "https://github.com/",
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "hover:text-blue-600",
    baseUrl: "https://linkedin.com/in/",
  },
  twitter: {
    name: "Twitter",
    icon: Twitter,
    color: "hover:text-blue-400",
    baseUrl: "https://twitter.com/",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "hover:text-pink-600",
    baseUrl: "https://instagram.com/",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "hover:text-blue-600",
    baseUrl: "https://facebook.com/",
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "hover:text-red-600",
    baseUrl: "https://youtube.com/",
  },
  email: {
    name: "Email",
    icon: Mail,
    color: "hover:text-green-600",
    baseUrl: "mailto:",
  },
  website: {
    name: "Website",
    icon: Globe,
    color: "hover:text-blue-500",
    baseUrl: "",
  },
} as const;

export type SocialPlatform = keyof typeof socialPlatforms;

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  username?: string;
  label?: string;
}

export interface SocialLinksProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof socialLinksVariants> {
  links: SocialLink[];
  showLabels?: boolean;
  showTooltips?: boolean;
  animated?: boolean;
}

const SocialLinks = React.forwardRef<HTMLDivElement, SocialLinksProps>(
  ({
    className,
    variant,
    size,
    styleVariant,
    links,
    showLabels = false,
    showTooltips = true,
    animated = true,
    ...props
  }, ref) => {
    const renderSocialItem = (link: SocialLink) => {
      const platform = socialPlatforms[link.platform];
      const Icon = platform.icon;
      const label = link.label || platform.name;
      
      // Determine the full URL
      const fullUrl = link.url.startsWith('http') 
        ? link.url 
        : `${platform.baseUrl}${link.url}`;

      const itemContent = (
        <>
          <Icon className="h-4 w-4" />
          {showLabels && (
            <span className="ml-2 text-sm font-medium">{label}</span>
          )}
        </>
      );

      const itemClassName = cn(
        socialItemVariants({ styleVariant, size }),
        platform.color,
        animated && "transform hover:scale-105 transition-transform duration-200",
        showLabels && "px-3 w-auto"
      );

      const socialItem = styleVariant === "links" ? (
        <Link
          key={link.platform}
          href={fullUrl}
          external
          className={itemClassName}
          aria-label={`Visit ${label}`}
        >
          {itemContent}
        </Link>
      ) : (
        <Button
          key={link.platform}
          variant="ghost"
          size="sm"
          asChild
          className={itemClassName}
        >
          <Link
            href={fullUrl}
            external
            aria-label={`Visit ${label}`}
          >
            {itemContent}
          </Link>
        </Button>
      );

      if (showTooltips && !showLabels) {
        return (
          <Tooltip key={link.platform}>
            <TooltipTrigger asChild>
              {socialItem}
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        );
      }

      return socialItem;
    };

    return (
      <div
        ref={ref}
        data-slot="social-links"
        className={cn(socialLinksVariants({ variant, size, styleVariant }), className)}
        {...props}
      >
        {links.map((link) => renderSocialItem(link))}
      </div>
    );
  }
);
SocialLinks.displayName = "SocialLinks";

// Preset social link components
const CompactSocialLinks = React.forwardRef<HTMLDivElement, Omit<SocialLinksProps, "variant">>(
  ({ ...props }, ref) => (
    <SocialLinks ref={ref} variant="compact" {...props} />
  )
);
CompactSocialLinks.displayName = "CompactSocialLinks";

const VerticalSocialLinks = React.forwardRef<HTMLDivElement, Omit<SocialLinksProps, "variant">>(
  ({ ...props }, ref) => (
    <SocialLinks ref={ref} variant="vertical" {...props} />
  )
);
VerticalSocialLinks.displayName = "VerticalSocialLinks";

const IconSocialLinks = React.forwardRef<HTMLDivElement, Omit<SocialLinksProps, "styleVariant">>(
  ({ ...props }, ref) => (
    <SocialLinks ref={ref} styleVariant="icons" {...props} />
  )
);
IconSocialLinks.displayName = "IconSocialLinks";

const LabeledSocialLinks = React.forwardRef<HTMLDivElement, Omit<SocialLinksProps, "showLabels">>(
  ({ ...props }, ref) => (
    <SocialLinks ref={ref} showLabels {...props} />
  )
);
LabeledSocialLinks.displayName = "LabeledSocialLinks";

// Helper function to create social links from common data
export const createSocialLinks = (data: {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  email?: string;
  website?: string;
}): SocialLink[] => {
  return Object.entries(data)
    .filter(([, value]) => value)
    .map(([platform, url]) => ({
      platform: platform as SocialPlatform,
      url: url as string,
    }));
};

export {
  SocialLinks,
  CompactSocialLinks,
  VerticalSocialLinks,
  IconSocialLinks,
  LabeledSocialLinks,
  socialLinksVariants,
  socialItemVariants,
  socialPlatforms,
};