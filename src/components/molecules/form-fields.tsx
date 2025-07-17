import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const fieldVariants = cva(
  "space-y-2",
  {
    variants: {
      variant: {
        default: "",
        inline: "flex items-center space-y-0 space-x-4",
        floating: "relative",
      },
      state: {
        default: "",
        error: "",
        success: "",
        warning: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        floating: "absolute left-3 top-3 text-muted-foreground transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary",
        inline: "text-foreground min-w-0 flex-shrink-0",
      },
      state: {
        default: "",
        error: "text-destructive",
        success: "text-green-600",
        warning: "text-yellow-600",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-destructive",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      required: false,
    },
  }
);

const inputVariants = cva(
  "",
  {
    variants: {
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

const helperTextVariants = cva(
  "text-xs",
  {
    variants: {
      state: {
        default: "text-muted-foreground",
        error: "text-destructive",
        success: "text-green-600",
        warning: "text-yellow-600",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

// Base Field Props
interface BaseFieldProps extends VariantProps<typeof fieldVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Text Field Component
export interface TextFieldProps
  extends BaseFieldProps,
    Omit<React.ComponentProps<typeof Input>, "className"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const TextField = React.forwardRef<
  React.ElementRef<typeof Input>,
  TextFieldProps
>(({
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  variant = "default",
  state: stateProp,
  className,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const state = error ? "error" : stateProp || "default";
  const fieldId = React.useId();

  return (
    <div className={cn(fieldVariants({ variant }), className)}>
      {label && variant !== "floating" && (
        <Label
          htmlFor={fieldId}
          className={cn(labelVariants({ variant, state, required }))}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <Input
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-invalid={state === "error"}
          aria-describedby={
            error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
          }
          className={cn(
            inputVariants({ state }),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            variant === "floating" && "peer placeholder-transparent"
          )}
          {...props}
        />
        
        {variant === "floating" && label && (
          <Label
            htmlFor={fieldId}
            className={cn(labelVariants({ variant: "floating", state, required }))}
          >
            {label}
          </Label>
        )}
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
        
        {state === "error" && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
        
        {state === "success" && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
        )}
      </div>
      
      {error && (
        <p id={`${fieldId}-error`} className={cn(helperTextVariants({ state: "error" }))}>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={`${fieldId}-helper`} className={cn(helperTextVariants({ state }))}>
          {helperText}
        </p>
      )}
    </div>
  );
});
TextField.displayName = "TextField";

// Password Field Component
export interface PasswordFieldProps extends Omit<TextFieldProps, "type" | "rightIcon"> {
  // Inherits all TextFieldProps except type and rightIcon
}

const PasswordField = React.forwardRef<
  React.ElementRef<typeof Input>,
  PasswordFieldProps
>(({ ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <TextField
      ref={ref}
      type={showPassword ? "text" : "password"}
      rightIcon={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto p-0 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      }
      {...props}
    />
  );
});
PasswordField.displayName = "PasswordField";

// Textarea Field Component
export interface TextareaFieldProps
  extends BaseFieldProps,
    Omit<React.ComponentProps<typeof Textarea>, "className"> {
  showCharCount?: boolean;
  maxLength?: number;
}

const TextareaField = React.forwardRef<
  React.ElementRef<typeof Textarea>,
  TextareaFieldProps
>(({
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  variant = "default",
  state: stateProp,
  className,
  showCharCount = false,
  maxLength,
  value,
  ...props
}, ref) => {
  const state = error ? "error" : stateProp || "default";
  const fieldId = React.useId();
  const charCount = typeof value === "string" ? value.length : 0;

  return (
    <div className={cn(fieldVariants({ variant }), className)}>
      {label && (
        <Label
          htmlFor={fieldId}
          className={cn(labelVariants({ variant, state, required }))}
        >
          {label}
        </Label>
      )}
      
      <Textarea
        ref={ref}
        id={fieldId}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        aria-invalid={state === "error"}
        aria-describedby={
          error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
        }
        className={cn(inputVariants({ state }))}
        {...props}
      />
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {error && (
            <p id={`${fieldId}-error`} className={cn(helperTextVariants({ state: "error" }))}>
              {error}
            </p>
          )}
          
          {helperText && !error && (
            <p id={`${fieldId}-helper`} className={cn(helperTextVariants({ state }))}>
              {helperText}
            </p>
          )}
        </div>
        
        {showCharCount && (
          <div className="text-xs text-muted-foreground ml-2">
            {charCount}{maxLength && `/${maxLength}`}
          </div>
        )}
      </div>
    </div>
  );
});
TextareaField.displayName = "TextareaField";

// Select Field Component (using native select for now)
export interface SelectFieldProps
  extends BaseFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({
    label,
    helperText,
    error,
    required = false,
    disabled = false,
    variant = "default",
    state: stateProp,
    className,
    options,
    placeholder,
    ...props
  }, ref) => {
    const state = error ? "error" : stateProp || "default";
    const fieldId = React.useId();

    return (
      <div className={cn(fieldVariants({ variant }), className)}>
        {label && (
          <Label
            htmlFor={fieldId}
            className={cn(labelVariants({ variant, state, required }))}
          >
            {label}
          </Label>
        )}
        
        <select
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-invalid={state === "error"}
          aria-describedby={
            error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
          }
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            inputVariants({ state })
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p id={`${fieldId}-error`} className={cn(helperTextVariants({ state: "error" }))}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${fieldId}-helper`} className={cn(helperTextVariants({ state }))}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

// Checkbox Field Component
export interface CheckboxFieldProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  description?: string;
}

const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({
    label,
    helperText,
    error,
    required = false,
    disabled = false,
    variant = "default",
    state: stateProp,
    className,
    description,
    ...props
  }, ref) => {
    const state = error ? "error" : stateProp || "default";
    const fieldId = React.useId();

    return (
      <div className={cn(fieldVariants({ variant }), className)}>
        <div className="flex items-start space-x-3">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={state === "error"}
            aria-describedby={
              error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
            }
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
          
          <div className="flex-1 space-y-1">
            {label && (
              <Label
                htmlFor={fieldId}
                className={cn(labelVariants({ variant, state, required }))}
              >
                {label}
              </Label>
            )}
            
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        
        {error && (
          <p id={`${fieldId}-error`} className={cn(helperTextVariants({ state: "error" }))}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p id={`${fieldId}-helper`} className={cn(helperTextVariants({ state }))}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
CheckboxField.displayName = "CheckboxField";

export {
  TextField,
  PasswordField,
  TextareaField,
  SelectField,
  CheckboxField,
  fieldVariants,
  labelVariants,
  inputVariants,
  helperTextVariants,
};