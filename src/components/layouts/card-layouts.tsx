"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Image } from "@/components/atoms/image";
import { ExternalLink } from "lucide-react";

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border",
        outlined: "border-2 border-border",
        elevated: "shadow-md hover:shadow-lg",
        ghost: "border-0 shadow-none bg-transparent",
        filled: "bg-muted border-0",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        none: "",
        lift: "hover:shadow-md hover:-translate-y-1",
        glow: "hover:shadow-lg hover:shadow-primary/25",
        scale: "hover:scale-105",
        border: "hover:border-primary",
      },
      clickable: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hover: "none",
      clickable: false,
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: "div" | "article" | "section";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, clickable, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant, size, hover, clickable }), className)}
        {...(props as any)}
      />
    );
  }
);

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
  avatar?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, badge, actions, avatar, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-start justify-between space-x-4", className)} {...props}>
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {avatar && <div className="flex-shrink-0">{avatar}</div>}
          <div className="flex-1 min-w-0">
            {title && (
              <div className="flex items-center gap-2 mb-1">
                <Typography variant="h3" className="truncate">
                  {title}
                </Typography>
                {badge && (
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                )}
              </div>
            )}
            {subtitle && (
              <Typography variant="muted" className="text-sm truncate">
                {subtitle}
              </Typography>
            )}
            {children}
          </div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: "none" | "sm" | "md" | "lg";
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, spacing = "md", ...props }, ref) => {
    const spacingClasses = {
      none: "",
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
    };
    
    return (
      <div
        ref={ref}
        className={cn(spacingClasses[spacing], className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = "CardContent";

// Card Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, actions, meta, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center justify-between", className)} {...props}>
        <div className="flex items-center space-x-4">
          {meta}
          {children}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    );
  }
);

CardFooter.displayName = "CardFooter";

// Card Image
interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: "square" | "video" | "wide" | "tall";
  className?: string;
}

export const CardImage = React.forwardRef<HTMLDivElement, CardImageProps>(
  ({ src, alt, aspectRatio = "video", className }, ref) => {
    const aspectRatioClasses = {
      square: "aspect-square",
      video: "aspect-video",
      wide: "aspect-[21/9]",
      tall: "aspect-[3/4]",
    };

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden rounded-md", aspectRatioClasses[aspectRatio], className)}
      >
        <Image
          src={src}
          alt={alt}
          width={400}
          height={300}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
    );
  }
);

CardImage.displayName = "CardImage";

// Preset Card Layouts

// Basic Card
interface BasicCardProps extends CardProps {
  title?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
    aspectRatio?: "square" | "video" | "wide" | "tall";
  };
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export const BasicCard = React.forwardRef<HTMLDivElement, BasicCardProps>(
  ({ title, description, image, actions, children, ...props }, ref) => {
    return (
      <Card ref={ref} {...props}>
        {image && (
          <CardImage
            src={image.src}
            alt={image.alt}
            aspectRatio={image.aspectRatio}
            className="mb-4"
          />
        )}
        
        {title && (
          <CardHeader title={title} className="pb-4" />
        )}
        
        <CardContent>
          {description && (
            <Typography variant="muted">{description}</Typography>
          )}
          {children}
        </CardContent>
        
        {actions && actions.length > 0 && (
          <>
            <Separator className="my-4" />
            <CardFooter>
              <div className="flex gap-2">
                {actions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={action.onClick}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    );
  }
);

BasicCard.displayName = "BasicCard";

// Feature Card
interface FeatureCardProps extends CardProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  link?: {
    href: string;
    label?: string;
  };
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon: IconComponent, title, description, link, ...props }, ref) => {
    return (
      <Card ref={ref} hover="lift" {...props}>
        <CardContent>
          {IconComponent && (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
          )}
          
          <Typography variant="h4" className="mb-2">
            {title}
          </Typography>
          
          <Typography variant="muted" className="mb-4">
            {description}
          </Typography>
          
          {link && (
            <a
              href={link.href}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              {link.label || "Learn more"}
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          )}
        </CardContent>
      </Card>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

// Stats Card
interface StatsCardProps extends CardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: React.ComponentType<{ className?: string }>;
}

export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ label, value, change, icon: IconComponent, ...props }, ref) => {
    return (
      <Card ref={ref} {...props}>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small" className="text-muted-foreground mb-1">
                {label}
              </Typography>
              <Typography variant="h2" className="font-bold">
                {value}
              </Typography>
              {change && (
                <div className="flex items-center mt-1">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      change.trend === "up" && "text-green-600 dark:text-green-400",
                      change.trend === "down" && "text-red-600 dark:text-red-400",
                      change.trend === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {change.value}
                  </span>
                </div>
              )}
            </div>
            {IconComponent && (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

StatsCard.displayName = "StatsCard";

// Profile Card
interface ProfileCardProps extends CardProps {
  avatar: {
    src: string;
    alt: string;
  };
  name: string;
  role?: string;
  bio?: string;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  }>;
}

export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ avatar, name, role, bio, stats, actions, ...props }, ref) => {
    return (
      <Card ref={ref} {...props}>
        <CardContent>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
              <Image
                src={avatar.src}
                alt={avatar.alt}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            
            <Typography variant="h3" className="mb-1">
              {name}
            </Typography>
            
            {role && (
              <Typography variant="muted" className="mb-4">
                {role}
              </Typography>
            )}
            
            {bio && (
              <Typography variant="small" className="text-center mb-4">
                {bio}
              </Typography>
            )}
            
            {stats && stats.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {stats.map((stat, index) => (
                    <div key={index}>
                      <Typography variant="h4" className="font-bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="small" className="text-muted-foreground">
                        {stat.label}
                      </Typography>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {actions && actions.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="flex gap-2 justify-center">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || "outline"}
                      size="sm"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProfileCard.displayName = "ProfileCard";

export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
  CardImageProps,
  BasicCardProps,
  FeatureCardProps,
  StatsCardProps,
  ProfileCardProps,
};