"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/typography";
import { Loading } from "@/components/atoms/loading";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/atoms/icon";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Circle,
} from "lucide-react";

const wizardVariants = cva(
  "w-full max-w-4xl mx-auto bg-background border border-border rounded-lg shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        card: "shadow-md",
        minimal: "border-0 shadow-none",
      },
      size: {
        sm: "max-w-2xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        full: "max-w-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const stepVariants = cva(
  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
  {
    variants: {
      status: {
        pending: "border-muted bg-background text-muted-foreground",
        current: "border-primary bg-primary text-primary-foreground",
        completed: "border-green-500 bg-green-500 text-white",
        error: "border-red-500 bg-red-500 text-white",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  optional?: boolean;
  validation?: () => boolean | Promise<boolean>;
  onEnter?: () => void | Promise<void>;
  onExit?: () => void | Promise<void>;
}

interface FormWizardProps extends VariantProps<typeof wizardVariants> {
  className?: string;
  steps: WizardStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void | Promise<void>;
  onCancel?: () => void;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  allowStepNavigation?: boolean;
  nextText?: string;
  previousText?: string;
  finishText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
}

const StepIndicator = React.forwardRef<
  HTMLDivElement,
  {
    step: WizardStep;
    index: number;
    status: "pending" | "current" | "completed" | "error";
    showNumbers?: boolean;
    onClick?: () => void;
    clickable?: boolean;
  }
>(({ step, index, status, showNumbers = false, onClick, clickable = false }, ref) => {
  const getStepIcon = () => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "current":
        return showNumbers ? (
          <span className="text-sm font-medium">{index + 1}</span>
        ) : (
          <Clock className="w-4 h-4" />
        );
      default:
        return showNumbers ? (
          <span className="text-sm font-medium">{index + 1}</span>
        ) : (
          <Circle className="w-4 h-4" />
        );
    }
  };

  return (
    <div ref={ref} className="flex flex-col items-center space-y-2">
      <button
        type="button"
        onClick={clickable ? onClick : undefined}
        disabled={!clickable}
        className={cn(
          stepVariants({ status }),
          clickable && "hover:scale-105 cursor-pointer",
          !clickable && "cursor-default"
        )}
        aria-label={`Step ${index + 1}: ${step.title}`}
      >
        {getStepIcon()}
      </button>
      <div className="text-center max-w-24">
        <Typography
          variant="small"
          className={cn(
            "font-medium truncate",
            status === "current" && "text-primary",
            status === "completed" && "text-green-600 dark:text-green-400",
            status === "error" && "text-red-600 dark:text-red-400"
          )}
        >
          {step.title}
        </Typography>
        {step.optional && (
          <Badge variant="secondary" className="text-xs mt-1">
            Optional
          </Badge>
        )}
      </div>
    </div>
  );
});
StepIndicator.displayName = "StepIndicator";

export const FormWizard = React.forwardRef<HTMLDivElement, FormWizardProps>(
  (
    {
      className,
      variant,
      size,
      steps,
      currentStep = 0,
      onStepChange,
      onComplete,
      onCancel,
      showProgress = true,
      showStepNumbers = false,
      allowStepNavigation = false,
      nextText = "Next",
      previousText = "Previous",
      finishText = "Finish",
      cancelText = "Cancel",
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalStep, setInternalStep] = React.useState(currentStep);
    const [stepErrors, setStepErrors] = React.useState<Record<number, boolean>>({});
    const [isValidating, setIsValidating] = React.useState(false);

    const activeStep = onStepChange ? currentStep : internalStep;
    const currentStepData = steps[activeStep];

    const updateStep = (newStep: number) => {
      if (onStepChange) {
        onStepChange(newStep);
      } else {
        setInternalStep(newStep);
      }
    };

    const getStepStatus = (index: number) => {
      if (stepErrors[index]) return "error";
      if (index < activeStep) return "completed";
      if (index === activeStep) return "current";
      return "pending";
    };

    const validateCurrentStep = async (): Promise<boolean> => {
      if (!currentStepData?.validation) return true;

      setIsValidating(true);
      try {
        const isValid = await currentStepData.validation();
        setStepErrors(prev => ({ ...prev, [activeStep]: !isValid }));
        return isValid;
      } catch {
        setStepErrors(prev => ({ ...prev, [activeStep]: true }));
        return false;
      } finally {
        setIsValidating(false);
      }
    };

    const handleNext = async () => {
      if (disabled || loading || isValidating) return;

      const isValid = await validateCurrentStep();
      if (!isValid) return;

      if (currentStepData?.onExit) {
        await currentStepData.onExit();
      }

      if (activeStep < steps.length - 1) {
        const nextStep = activeStep + 1;
        const nextStepData = steps[nextStep];
        
        if (nextStepData?.onEnter) {
          await nextStepData.onEnter();
        }
        
        updateStep(nextStep);
      } else {
        if (onComplete) {
          await onComplete();
        }
      }
    };

    const handlePrevious = async () => {
      if (disabled || loading || activeStep <= 0) return;

      if (currentStepData?.onExit) {
        await currentStepData.onExit();
      }

      const prevStep = activeStep - 1;
      const prevStepData = steps[prevStep];
      
      if (prevStepData?.onEnter) {
        await prevStepData.onEnter();
      }
      
      updateStep(prevStep);
    };

    const handleStepClick = async (stepIndex: number) => {
      if (!allowStepNavigation || disabled || loading || stepIndex === activeStep) return;

      // Only allow navigation to completed steps or the next step
      if (stepIndex > activeStep + 1) return;
      if (stepIndex > activeStep) {
        const isValid = await validateCurrentStep();
        if (!isValid) return;
      }

      if (currentStepData?.onExit) {
        await currentStepData.onExit();
      }

      const targetStepData = steps[stepIndex];
      if (targetStepData?.onEnter) {
        await targetStepData.onEnter();
      }

      updateStep(stepIndex);
    };

    const progressPercentage = ((activeStep + 1) / steps.length) * 100;
    const isLastStep = activeStep === steps.length - 1;
    const canGoNext = !disabled && !loading && !isValidating;
    const canGoPrevious = !disabled && !loading && activeStep > 0;

    return (
      <div ref={ref} className={cn(wizardVariants({ variant, size }), className)} {...props}>
        {/* Header with Steps */}
        <div className="p-6 border-b border-border">
          {/* Progress Bar */}
          {showProgress && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="small" className="text-muted-foreground">
                  Step {activeStep + 1} of {steps.length}
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  {Math.round(progressPercentage)}% Complete
                </Typography>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepIndicator
                  step={step}
                  index={index}
                  status={getStepStatus(index)}
                  showNumbers={showStepNumbers}
                  onClick={() => handleStepClick(index)}
                  clickable={allowStepNavigation}
                />
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="p-6">
          <div className="mb-6">
            <Typography variant="h3" className="mb-2">
              {currentStepData?.title}
            </Typography>
            {currentStepData?.description && (
              <Typography variant="muted" className="mb-4">
                {currentStepData.description}
              </Typography>
            )}
            {stepErrors[activeStep] && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <Typography variant="small" className="text-red-600 dark:text-red-400">
                  Please fix the errors in this step before continuing.
                </Typography>
              </div>
            )}
          </div>

          <div className="min-h-[200px]">
            {currentStepData?.content}
          </div>
        </div>

        {/* Footer with Navigation */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              {onCancel && (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  disabled={disabled || loading}
                >
                  {cancelText}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={!canGoPrevious}
              >
                <Icon icon={ChevronLeft} className="w-4 h-4 mr-1" />
                {previousText}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canGoNext}
              >
                {(loading || isValidating) && (
                  <Loading size="sm" className="mr-2" />
                )}
                {isLastStep ? finishText : nextText}
                {!isLastStep && (
                  <Icon icon={ChevronRight} className="w-4 h-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

FormWizard.displayName = "FormWizard";

export type { FormWizardProps, WizardStep };