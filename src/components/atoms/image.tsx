"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import NextImage from "next/image";

import { cn } from "@/lib/utils";

const imageVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        rounded: "rounded-md",
        circle: "rounded-full",
        square: "aspect-square object-cover",
        avatar: "rounded-full aspect-square object-cover",
      },
      size: {
        xs: "w-8 h-8",
        sm: "w-12 h-12",
        default: "w-16 h-16",
        lg: "w-24 h-24",
        xl: "w-32 h-32",
        "2xl": "w-40 h-40",
        full: "w-full h-auto",
      },
      fit: {
        cover: "object-cover",
        contain: "object-contain",
        fill: "object-fill",
        none: "object-none",
        scaleDown: "object-scale-down",
      },
      loadingBehavior: {
        lazy: "",
        eager: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fit: "cover",
      loadingBehavior: "lazy",
    },
  }
);

export interface ImageProps
  extends Omit<React.ComponentProps<typeof NextImage>, "className">,
    VariantProps<typeof imageVariants> {
  className?: string;
  fallback?: React.ReactNode;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onError?: () => void;
  showFallback?: boolean;
}

const ImageComponent = React.forwardRef<
  React.ElementRef<typeof NextImage>,
  ImageProps
>(({
  className,
  variant,
  size,
  fit,
  loading = "lazy",
  fallback,
  placeholder,
  blurDataURL,
  onError,
  showFallback = true,
  alt,
  ...props
}, ref) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const handleError = React.useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  }, [onError]);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  // Show fallback if there's an error and fallback is enabled
  if (hasError && showFallback) {
    return (
      <div
        data-slot="image-fallback"
        className={cn(
          imageVariants({ variant, size, fit }),
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
      >
        {fallback || (
          <svg
            className="w-1/2 h-1/2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <NextImage
        ref={ref}
        data-slot="image"
        className={cn(
          imageVariants({ variant, size, fit }),
          isLoading && "opacity-0",
          !isLoading && "opacity-100",
          className
        )}
        alt={alt}
        loading={loading}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div
          data-slot="image-skeleton"
          className={cn(
            imageVariants({ variant, size, fit }),
            "absolute inset-0 animate-pulse bg-muted",
            className
          )}
        />
      )}
    </div>
  );
});
ImageComponent.displayName = "Image";

// Preset image components for common use cases
const Avatar = React.forwardRef<
  React.ElementRef<typeof NextImage>,
  Omit<ImageProps, "variant">
>(({ size = "default", ...props }, ref) => (
  <ImageComponent
    ref={ref}
    variant="avatar"
    size={size}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const ProfileImage = React.forwardRef<
  React.ElementRef<typeof NextImage>,
  Omit<ImageProps, "variant" | "size">
>(({ ...props }, ref) => (
  <ImageComponent
    ref={ref}
    variant="circle"
    size="xl"
    {...props}
  />
));
ProfileImage.displayName = "ProfileImage";

const ThumbnailImage = React.forwardRef<
  React.ElementRef<typeof NextImage>,
  Omit<ImageProps, "variant" | "size">
>(({ ...props }, ref) => (
  <ImageComponent
    ref={ref}
    variant="rounded"
    size="lg"
    {...props}
  />
));
ThumbnailImage.displayName = "ThumbnailImage";

const HeroImage = React.forwardRef<
  React.ElementRef<typeof NextImage>,
  Omit<ImageProps, "variant" | "size">
>(({ ...props }, ref) => (
  <ImageComponent
    ref={ref}
    variant="default"
    size="full"
    {...props}
  />
));
HeroImage.displayName = "HeroImage";

export {
  ImageComponent as Image,
  Avatar,
  ProfileImage,
  ThumbnailImage,
  HeroImage,
  imageVariants,
};