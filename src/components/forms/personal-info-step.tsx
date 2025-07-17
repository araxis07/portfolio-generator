"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
  createEmptyPersonalInfo,
} from "@/lib/validations/profile-form";
import { TextField, TextareaField } from "@/components/molecules/form-fields";
import { FileUpload, type FileUploadFile } from "@/components/molecules/file-upload";
import { Typography } from "@/components/atoms/typography";
import { Card } from "@/components/ui/card";

interface PersonalInfoStepProps {
  data?: PersonalInfoFormData;
  onDataChange?: (data: PersonalInfoFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
}

export const PersonalInfoStep = React.forwardRef<
  HTMLDivElement,
  PersonalInfoStepProps
>(({ data, onDataChange, onValidationChange, className }, ref) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data || createEmptyPersonalInfo(),
    mode: "onChange",
  });

  const watchedData = watch();
  const profilePhoto = watchedData.profilePhoto;

  // Notify parent of validation changes
  React.useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  // Notify parent of data changes
  React.useEffect(() => {
    onDataChange?.(watchedData);
  }, [watchedData, onDataChange]);

  // Handle profile photo upload
  const handlePhotoUpload = React.useCallback(
    (files: FileUploadFile[]) => {
      if (files.length > 0) {
        setValue("profilePhoto", files[0], { shouldValidate: true });
      } else {
        setValue("profilePhoto", undefined, { shouldValidate: true });
      }
    },
    [setValue]
  );

  // Handle profile photo file upload (mock implementation)
  const handlePhotoFileUpload = React.useCallback(
    async (file: FileUploadFile) => {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real implementation, you would upload to your storage service
      // For now, we'll create a mock URL
      file.url = URL.createObjectURL(file.file);
      file.status = "success";
    },
    []
  );

  const handlePhotoRemove = React.useCallback(
    () => {
      setValue("profilePhoto", undefined, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <div ref={ref} className={cn("space-y-6", className)}>
      {/* Profile Photo Section */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            <div className="relative">
              {profilePhoto?.url ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={profilePhoto.url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <Typography variant="h4" className="mb-2">
                Profile Photo
              </Typography>
              <Typography variant="muted" className="text-sm">
                Upload a professional photo that represents you well. This will be displayed on your portfolio.
              </Typography>
            </div>
            
            <FileUpload
              variant="compact"
              files={profilePhoto ? [profilePhoto] : []}
              onFilesChange={handlePhotoUpload}
              onFileUpload={handlePhotoFileUpload}
              onFileRemove={handlePhotoRemove}
              accept="image/*"
              maxFiles={1}
              maxSize={5 * 1024 * 1024} // 5MB
              showPreview={false}
            />
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4">
          Basic Information
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            leftIcon={<User className="w-4 h-4" />}
            error={errors.fullName?.message}
            required
            {...register("fullName")}
          />
          
          <TextField
            label="Professional Title"
            placeholder="e.g., Frontend Developer, UX Designer"
            error={errors.professionalTitle?.message}
            required
            {...register("professionalTitle")}
          />
        </div>
        
        <div className="mt-4">
          <TextareaField
            label="Bio / About Me"
            placeholder="Tell us about yourself, your experience, and what makes you unique..."
            helperText={`${watchedData.bio?.length || 0}/500 characters`}
            showCharCount
            maxLength={500}
            rows={4}
            error={errors.bio?.message}
            required
            {...register("bio")}
          />
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <Typography variant="h4" className="mb-4">
          Contact Information
        </Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            required
            {...register("email")}
          />
          
          <TextField
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            leftIcon={<Phone className="w-4 h-4" />}
            helperText="Optional - Include country code"
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
        
        <div className="mt-4">
          <TextField
            label="Location"
            placeholder="City, State/Province, Country"
            leftIcon={<MapPin className="w-4 h-4" />}
            helperText="Optional - Where are you based?"
            error={errors.location?.message}
            {...register("location")}
          />
        </div>
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
                • {error?.message}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Success Indicator */}
      {isValid && Object.keys(errors).length === 0 && watchedData.fullName && watchedData.email && watchedData.bio && (
        <Card className="p-4 border-green-500 bg-green-50 dark:bg-green-950">
          <Typography variant="small" className="text-green-600 dark:text-green-400 font-medium">
            ✓ Personal information is complete and valid
          </Typography>
        </Card>
      )}
    </div>
  );
});

PersonalInfoStep.displayName = "PersonalInfoStep";