"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/typography";
import { Loading } from "@/components/atoms/loading";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  HelpCircle,
  Trash2,
  Save,
} from "lucide-react";

const modalVariants = cva("", {
  variants: {
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      full: "max-w-[95vw]",
    },
    type: {
      default: "",
      success: "border-green-200 dark:border-green-800",
      warning: "border-yellow-200 dark:border-yellow-800",
      error: "border-red-200 dark:border-red-800",
      info: "border-blue-200 dark:border-blue-800",
    },
  },
  defaultVariants: {
    size: "md",
    type: "default",
  },
});

interface BaseModalProps extends VariantProps<typeof modalVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

// Confirmation Modal
interface ConfirmationModalProps extends BaseModalProps {
  variant?: "default" | "destructive";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const ConfirmationModal = React.forwardRef<
  HTMLDivElement,
  ConfirmationModalProps
>(
  (
    {
      open,
      onOpenChange,
      title = "Confirm Action",
      description,
      children,
      variant = "default",
      confirmText = "Confirm",
      cancelText = "Cancel",
      onConfirm,
      onCancel,
      loading = false,
      icon: IconComponent,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const handleConfirm = async () => {
      if (onConfirm) {
        await onConfirm();
      }
    };

    const handleCancel = () => {
      if (onCancel) {
        onCancel();
      } else {
        onOpenChange?.(false);
      }
    };

    const getIcon = () => {
      if (IconComponent) return IconComponent;
      switch (variant) {
        case "destructive":
          return AlertTriangle;
        default:
          return HelpCircle;
      }
    };

    const SelectedIcon = getIcon();

    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        <DialogContent
          ref={ref}
          className={cn(modalVariants({ size }), className)}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  variant === "destructive"
                    ? "bg-red-100 dark:bg-red-900/20"
                    : "bg-blue-100 dark:bg-blue-900/20"
                )}
              >
                <SelectedIcon
                  className={cn(
                    "w-5 h-5",
                    variant === "destructive"
                      ? "text-red-600 dark:text-red-400"
                      : "text-blue-600 dark:text-blue-400"
                  )}
                />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-left">{title}</DialogTitle>
                {description && (
                  <DialogDescription className="text-left mt-1">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {children && (
            <div className="py-4">
              {children}
            </div>
          )}

          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading && <Loading size="sm" className="mr-2" />}
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
ConfirmationModal.displayName = "ConfirmationModal";

// Alert Modal
interface AlertModalProps extends BaseModalProps {
  variant?: "success" | "warning" | "error" | "info";
  actionText?: string;
  onAction?: () => void;
}

export const AlertModal = React.forwardRef<HTMLDivElement, AlertModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      variant = "info",
      actionText = "OK",
      onAction,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const handleAction = () => {
      if (onAction) {
        onAction();
      } else {
        onOpenChange?.(false);
      }
    };

    const getIcon = () => {
      switch (variant) {
        case "success":
          return CheckCircle;
        case "warning":
          return AlertTriangle;
        case "error":
          return XCircle;
        default:
          return Info;
      }
    };

    const getIconColor = () => {
      switch (variant) {
        case "success":
          return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
        case "warning":
          return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
        case "error":
          return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
        default:
          return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
      }
    };

    const SelectedIcon = getIcon();

    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        <DialogContent
          ref={ref}
          className={cn(modalVariants({ size, type: variant }), className)}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  getIconColor()
                )}
              >
                <SelectedIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                {title && <DialogTitle className="text-left">{title}</DialogTitle>}
                {description && (
                  <DialogDescription className="text-left mt-1">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {children && (
            <div className="py-4">
              {children}
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleAction}>{actionText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
AlertModal.displayName = "AlertModal";

// Form Modal
interface FormModalProps extends BaseModalProps {
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  submitDisabled?: boolean;
}

export const FormModal = React.forwardRef<HTMLDivElement, FormModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      footer,
      onSubmit,
      submitText = "Save",
      cancelText = "Cancel",
      loading = false,
      submitDisabled = false,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) {
        await onSubmit(e);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        <DialogContent
          ref={ref}
          className={cn(modalVariants({ size }), className)}
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>

            <div className="py-4">
              {children}
            </div>

            {footer || (
              <DialogFooter className="flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange?.(false)}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
                <Button
                  type="submit"
                  disabled={loading || submitDisabled}
                >
                  {loading && <Loading size="sm" className="mr-2" />}
                  {submitText}
                </Button>
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);
FormModal.displayName = "FormModal";

// Mobile Sheet Modal
interface SheetModalProps extends BaseModalProps {
  side?: "top" | "right" | "bottom" | "left";
  trigger?: React.ReactNode;
}

export const SheetModal = React.forwardRef<HTMLDivElement, SheetModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      footer,
      side = "right",
      trigger,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Sheet open={open} onOpenChange={onOpenChange} {...props}>
        {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
        <SheetContent ref={ref} side={side} className={cn(className)}>
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>

          <div className="flex-1 py-4">
            {children}
          </div>

          {footer && <SheetFooter>{footer}</SheetFooter>}
        </SheetContent>
      </Sheet>
    );
  }
);
SheetModal.displayName = "SheetModal";

// Loading Modal
interface LoadingModalProps extends Omit<BaseModalProps, "children"> {
  message?: string;
  progress?: number;
  showProgress?: boolean;
}

export const LoadingModal = React.forwardRef<HTMLDivElement, LoadingModalProps>(
  (
    {
      open,
      onOpenChange,
      title = "Loading...",
      message,
      progress,
      showProgress = false,
      size = "sm",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} {...props}>
        <DialogContent
          ref={ref}
          className={cn(modalVariants({ size }), "text-center", className)}
        >
          <div className="py-6">
            <Loading size="lg" className="mx-auto mb-4" />
            <Typography variant="h4" className="mb-2">
              {title}
            </Typography>
            {message && (
              <Typography variant="muted" className="mb-4">
                {message}
              </Typography>
            )}
            {showProgress && typeof progress === "number" && (
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
LoadingModal.displayName = "LoadingModal";

// Quick Action Modals
export const DeleteConfirmationModal = (
  props: Omit<ConfirmationModalProps, "variant" | "icon" | "confirmText">
) => (
  <ConfirmationModal
    variant="destructive"
    icon={Trash2}
    confirmText="Delete"
    title="Delete Item"
    description="This action cannot be undone. Are you sure you want to delete this item?"
    {...props}
  />
);

export const SaveConfirmationModal = (
  props: Omit<ConfirmationModalProps, "icon" | "confirmText">
) => (
  <ConfirmationModal
    icon={Save}
    confirmText="Save"
    title="Save Changes"
    description="Do you want to save your changes?"
    {...props}
  />
);

export const UploadModal = (props: FormModalProps) => (
  <FormModal
    title="Upload File"
    submitText="Upload"
    size="lg"
    {...props}
  />
);

export const DownloadModal = (props: LoadingModalProps) => (
  <LoadingModal
    title="Preparing Download"
    message="Please wait while we prepare your file..."
    {...props}
  />
);

// Export types
export type {
  BaseModalProps,
  ConfirmationModalProps,
  AlertModalProps,
  FormModalProps,
  SheetModalProps,
  LoadingModalProps,
};