"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Plus, 
  X, 
  Link as LinkIcon, 
  Linkedin, 
  Github, 
  Twitter, 
  Globe, 
  Eye, 
  EyeOff,
  Bell,
  Shield,
  Check
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  socialLinksContactSchema,
  type SocialLinksContactFormData,
  type SocialLink,
  createEmptySocialLinksContact,
  PORTFOLIO_VISIBILITY_OPTIONS,
} from "@/lib/validations/profile-form";
import { TextField, SelectField, CheckboxField } from "@/components/molecules/form-fields";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/atoms/typography";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SocialLinksContactStepProps {
  data?: SocialLinksContactFormData;
  onDataChange?: (data: SocialLinksContactFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
}


export const SocialLinksContactStep = React.forwardRef<
  HTMLDivElement,
  SocialLinksContactStepProps
>(({ data, onDataChange, onValidationChange, className }, ref) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SocialLinksContactFormData>({
    resolver: zodResolver(socialLinksContactSchema),
    defaultValues: data || createEmptySocialLinksContact(),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customLinks",
  });

  const watchedData = watch();

  // Notify parent of validation changes
  React.useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  // Notify parent of data changes
  React.useEffect(() => {
    onDataChange?.(watchedData);
  }, [watchedData, onDataChange]);

  // Add custom link
  const handleAddCustomLink = () => {
    if (watchedData.customLinks.length < 5) {
      const newLink: SocialLink = {
        id: `custom-link-${Date.now()}`,
        platform: "",
        url: "",
        label: "",
      };
      
      append(newLink);
    }
  };

  // Remove custom link
  const handleRemoveCustomLink = (index: number) => {
    remove(index);
  };

  return (
    <div ref={ref} className={cn("space-y-6", className)}>
      {/* Main Social Platforms */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          Social Media Profiles
        </Typography>
        
        <Typography variant="muted" className="text-sm mb-6">
          Add your professional social media profiles to help people connect with you.
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="LinkedIn Profile"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            leftIcon={<Linkedin className="w-4 h-4" />}
            helperText="Your professional LinkedIn profile"
            error={errors.linkedin?.message}
            {...register("linkedin")}
          />
          
          <TextField
            label="GitHub Profile"
            type="url"
            placeholder="https://github.com/yourusername"
            leftIcon={<Github className="w-4 h-4" />}
            helperText="Your code repositories and projects"
            error={errors.github?.message}
            {...register("github")}
          />
          
          <TextField
            label="Twitter/X Profile"
            type="url"
            placeholder="https://twitter.com/yourusername"
            leftIcon={<Twitter className="w-4 h-4" />}
            helperText="Your Twitter or X profile"
            error={errors.twitter?.message}
            {...register("twitter")}
          />
          
          <TextField
            label="Personal Website"
            type="url"
            placeholder="https://yourwebsite.com"
            leftIcon={<Globe className="w-4 h-4" />}
            helperText="Your personal website or blog"
            error={errors.website?.message}
            {...register("website")}
          />
          
          <TextField
            label="Behance Portfolio"
            type="url"
            placeholder="https://behance.net/yourprofile"
            leftIcon={<LinkIcon className="w-4 h-4" />}
            helperText="For designers and creatives"
            error={errors.behance?.message}
            {...register("behance")}
          />
          
          <TextField
            label="Dribbble Profile"
            type="url"
            placeholder="https://dribbble.com/yourprofile"
            leftIcon={<LinkIcon className="w-4 h-4" />}
            helperText="For designers and creatives"
            error={errors.dribbble?.message}
            {...register("dribbble")}
          />
        </div>
      </Card>

      {/* Custom Links */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Custom Links ({watchedData.customLinks.length})
          </Typography>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCustomLink}
            disabled={watchedData.customLinks.length >= 5}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </div>
        
        <Typography variant="muted" className="text-sm mb-4">
          Add up to 5 custom links to other platforms, portfolios, or websites.
        </Typography>
        
        {watchedData.customLinks.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border rounded-lg">
            <LinkIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <Typography variant="muted">
              No custom links added yet. Click &quot;Add Link&quot; to get started.
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-end gap-4 p-4 border border-border rounded-lg bg-background"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField
                    label="Platform/Label"
                    placeholder="e.g., Portfolio, Blog, YouTube"
                    {...register(`customLinks.${index}.platform`)}
                    error={errors.customLinks?.[index]?.platform?.message}
                  />
                  
                  <TextField
                    label="Display Label"
                    placeholder="e.g., My Portfolio"
                    {...register(`customLinks.${index}.label`)}
                    error={errors.customLinks?.[index]?.label?.message}
                  />
                  
                  <TextField
                    label="URL"
                    type="url"
                    placeholder="https://example.com"
                    {...register(`customLinks.${index}.url`)}
                    error={errors.customLinks?.[index]?.url?.message}
                  />
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCustomLink(index)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remove custom link ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Contact Preferences */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Contact Preferences
        </Typography>
        
        <div className="space-y-4">
          <CheckboxField
            label="Email Notifications"
            description="Receive notifications about portfolio views and messages"
            {...register("contactPreferences.emailNotifications")}
          />
          
          <CheckboxField
            label="Public Profile"
            description="Allow your profile to be discoverable by others"
            {...register("contactPreferences.publicProfile")}
          />
          
          <Separator />
          
          <Typography variant="small" className="font-medium text-muted-foreground">
            Contact Information Display
          </Typography>
          
          <CheckboxField
            label="Show Email Address"
            description="Display your email address on your public portfolio"
            {...register("contactPreferences.showEmail")}
          />
          
          <CheckboxField
            label="Show Phone Number"
            description="Display your phone number on your public portfolio"
            {...register("contactPreferences.showPhone")}
          />
        </div>
      </Card>

      {/* Portfolio Visibility */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Portfolio Visibility
        </Typography>
        
        <SelectField
          label="Who can view your portfolio?"
          value={watchedData.portfolioVisibility}
          onChange={(e) => setValue("portfolioVisibility", e.target.value as any, { shouldValidate: true })}
          options={PORTFOLIO_VISIBILITY_OPTIONS.map(option => ({ 
            value: option.value, 
            label: option.label 
          }))}
          error={errors.portfolioVisibility?.message}
        />
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            {watchedData.portfolioVisibility === "public" ? (
              <Eye className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <EyeOff className="w-5 h-5 text-yellow-600 mt-0.5" />
            )}
            <div>
              <Typography variant="small" className="font-medium mb-1">
                {PORTFOLIO_VISIBILITY_OPTIONS.find(opt => opt.value === watchedData.portfolioVisibility)?.label}
              </Typography>
              <Typography variant="small" className="text-muted-foreground">
                {watchedData.portfolioVisibility === "public" && 
                  "Your portfolio will be visible to everyone and may appear in search results."}
                {watchedData.portfolioVisibility === "unlisted" && 
                  "Your portfolio can only be accessed by people with the direct link."}
                {watchedData.portfolioVisibility === "private" && 
                  "Only you can view your portfolio. Perfect for drafts and personal use."}
              </Typography>
            </div>
          </div>
        </div>
      </Card>

      {/* Terms of Service */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4 flex items-center gap-2">
          <Check className="w-5 h-5" />
          Terms & Conditions
        </Typography>
        
        <CheckboxField
          label="I accept the Terms of Service and Privacy Policy"
          description="By checking this box, you agree to our Terms of Service and Privacy Policy."
          required
          error={errors.termsAccepted?.message}
          {...register("termsAccepted")}
        />
      </Card>

      {/* Form Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <Card className="p-4 border-destructive bg-destructive/5">
          <Typography variant="small" className="text-destructive font-medium mb-2">
            Please fix the following errors:
          </Typography>
          <ul className="space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="text-sm text-destructive">
                • {error?.message || `Error in ${field}`}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Success Indicator */}
      {isValid && watchedData.termsAccepted && (
        <Card className="p-4 border-green-500 bg-green-50 dark:bg-green-950">
          <Typography variant="small" className="text-green-600 dark:text-green-400 font-medium">
            ✓ Social links and contact preferences are complete
          </Typography>
        </Card>
      )}
    </div>
  );
});

SocialLinksContactStep.displayName = "SocialLinksContactStep";