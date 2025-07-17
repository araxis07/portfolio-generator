"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, FolderOpen, Link as LinkIcon } from "lucide-react";

import { FormWizard, type WizardStep } from "@/components/organisms/form-wizard";
import { PersonalInfoStep } from "@/components/forms/personal-info-step";
import { SkillsExpertiseStep } from "@/components/forms/skills-expertise-step";
import { ProjectsPortfolioStep } from "@/components/forms/projects-portfolio-step";
import { SocialLinksContactStep } from "@/components/forms/social-links-contact-step";
import { PageWrapper } from "@/components/layouts/page-wrapper";
import { Container } from "@/components/layouts/container";
import { Typography } from "@/components/atoms/typography";
import { usePortfolios } from "@/hooks/use-portfolio";
import type { Portfolio } from "@/types";
import {
  type PersonalInfoFormData,
  type SkillsExpertiseFormData,
  type ProjectsPortfolioFormData,
  type SocialLinksContactFormData,
  type CompleteProfileFormData,
  createEmptyPersonalInfo,
  createEmptySkillsExpertise,
  createEmptyProjectsPortfolio,
  createEmptySocialLinksContact,
} from "@/lib/validations/profile-form";

// Simple toast notification function
const showToast = (message: string, type: "success" | "error" = "success") => {
  // For now, use console.log - can be replaced with a proper toast library later
  console.log(`${type.toUpperCase()}: ${message}`);
  if (type === "error") {
    alert(`Error: ${message}`);
  } else {
    alert(`Success: ${message}`);
  }
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const { createPortfolio, loading } = usePortfolios();

  // Form data state for each step
  const [personalInfo, setPersonalInfo] = React.useState<PersonalInfoFormData>(
    createEmptyPersonalInfo
  );
  const [skillsExpertise, setSkillsExpertise] = React.useState<SkillsExpertiseFormData>(
    createEmptySkillsExpertise
  );
  const [projectsPortfolio, setProjectsPortfolio] = React.useState<ProjectsPortfolioFormData>(
    createEmptyProjectsPortfolio
  );
  const [socialLinksContact, setSocialLinksContact] = React.useState<SocialLinksContactFormData>(
    createEmptySocialLinksContact
  );

  // Validation state for each step
  const [stepValidation, setStepValidation] = React.useState({
    personalInfo: false,
    skillsExpertise: false,
    projectsPortfolio: false,
    socialLinksContact: false,
  });

  // Current step state
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Auto-save functionality
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleAutoSave = React.useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      const completeData: CompleteProfileFormData = {
        personalInfo,
        skillsExpertise,
        projectsPortfolio,
        socialLinksContact,
      };

      // Save to localStorage as draft
      localStorage.setItem("portfolio-draft", JSON.stringify(completeData));
    }, 1000); // Auto-save after 1 second of inactivity
  }, [personalInfo, skillsExpertise, projectsPortfolio, socialLinksContact]);

  // Trigger auto-save when data changes
  React.useEffect(() => {
    handleAutoSave();
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [handleAutoSave]);

  // Load draft data on mount
  React.useEffect(() => {
    const draftData = localStorage.getItem("portfolio-draft");
    if (draftData) {
      try {
        const parsed: CompleteProfileFormData = JSON.parse(draftData);
        setPersonalInfo(parsed.personalInfo || createEmptyPersonalInfo());
        setSkillsExpertise(parsed.skillsExpertise || createEmptySkillsExpertise());
        setProjectsPortfolio(parsed.projectsPortfolio || createEmptyProjectsPortfolio());
        setSocialLinksContact(parsed.socialLinksContact || createEmptySocialLinksContact());
      } catch (error) {
        console.error("Failed to load draft data:", error);
      }
    }
  }, []);

  // Handle form completion
  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Create a new portfolio from the form data
      const newPortfolio: Portfolio = {
        id: `portfolio-${Date.now()}`,
        title: `${personalInfo.fullName}'s Portfolio`,
        description: personalInfo.bio,
        theme: {
          id: "default",
          name: "Default Theme",
          colors: {
            primary: "#3b82f6",
            secondary: "#64748b",
            accent: "#f59e0b",
            background: "#ffffff",
            foreground: "#0f172a",
            muted: "#f1f5f9",
            border: "#e2e8f0",
          },
          fonts: {
            heading: "Inter",
            body: "Inter",
            mono: "JetBrains Mono",
          },
          spacing: {
            xs: "0.25rem",
            sm: "0.5rem",
            md: "1rem",
            lg: "1.5rem",
            xl: "3rem",
          },
          borderRadius: "0.5rem",
        },
        sections: [], // Will be populated from form data
        settings: {
          isPublic: socialLinksContact.portfolioVisibility === "public",
          seoTitle: `${personalInfo.fullName}'s Portfolio`,
          seoDescription: personalInfo.bio,
          socialLinks: [
            ...(socialLinksContact.linkedin ? [{ platform: "linkedin", url: socialLinksContact.linkedin, isVisible: true }] : []),
            ...(socialLinksContact.github ? [{ platform: "github", url: socialLinksContact.github, isVisible: true }] : []),
            ...(socialLinksContact.twitter ? [{ platform: "twitter", url: socialLinksContact.twitter, isVisible: true }] : []),
            ...(socialLinksContact.website ? [{ platform: "website", url: socialLinksContact.website, isVisible: true }] : []),
            ...socialLinksContact.customLinks.map(link => ({ platform: link.platform, url: link.url, isVisible: true })),
          ],
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = createPortfolio(newPortfolio);
      
      if (result) {
        // Clear draft data after successful save
        localStorage.removeItem("portfolio-draft");
        
        showToast("Portfolio created successfully!");
        router.push("/profile");
      } else {
        throw new Error("Failed to create portfolio");
      }
    } catch (error) {
      console.error("Failed to save portfolio:", error);
      showToast("Failed to save portfolio. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Your progress will be saved as a draft.")) {
      router.push("/");
    }
  };

  // Define wizard steps
  const steps: WizardStep[] = [
    {
      id: "personal-info",
      title: "Personal Information",
      description: "Tell us about yourself and add a professional photo",
      content: (
        <PersonalInfoStep
          data={personalInfo}
          onDataChange={setPersonalInfo}
          onValidationChange={(isValid) =>
            setStepValidation(prev => ({ ...prev, personalInfo: isValid }))
          }
        />
      ),
      validation: () => stepValidation.personalInfo,
    },
    {
      id: "skills-expertise",
      title: "Skills & Expertise",
      description: "Showcase your skills and areas of expertise",
      content: (
        <SkillsExpertiseStep
          data={skillsExpertise}
          onDataChange={setSkillsExpertise}
          onValidationChange={(isValid) =>
            setStepValidation(prev => ({ ...prev, skillsExpertise: isValid }))
          }
        />
      ),
      validation: () => stepValidation.skillsExpertise,
    },
    {
      id: "projects-portfolio",
      title: "Projects & Portfolio",
      description: "Add your best projects and work samples",
      content: (
        <ProjectsPortfolioStep
          data={projectsPortfolio}
          onDataChange={setProjectsPortfolio}
          onValidationChange={(isValid) =>
            setStepValidation(prev => ({ ...prev, projectsPortfolio: isValid }))
          }
        />
      ),
      validation: () => stepValidation.projectsPortfolio,
    },
    {
      id: "social-contact",
      title: "Social Links & Contact",
      description: "Connect your social profiles and set contact preferences",
      content: (
        <SocialLinksContactStep
          data={socialLinksContact}
          onDataChange={setSocialLinksContact}
          onValidationChange={(isValid) =>
            setStepValidation(prev => ({ ...prev, socialLinksContact: isValid }))
          }
        />
      ),
      validation: () => stepValidation.socialLinksContact,
    },
  ];

  return (
    <PageWrapper>
      <Container size="lg" className="py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Typography variant="h1" className="mb-4">
            Create Your Portfolio
          </Typography>
          <Typography variant="large" className="text-muted-foreground max-w-2xl mx-auto">
            Follow these steps to create a comprehensive portfolio that showcases your skills, 
            projects, and professional experience.
          </Typography>
        </div>

        {/* Form Wizard */}
        <FormWizard
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onComplete={handleComplete}
          onCancel={handleCancel}
          showProgress={true}
          showStepNumbers={true}
          allowStepNavigation={true}
          nextText="Continue"
          previousText="Back"
          finishText="Create Portfolio"
          cancelText="Save as Draft"
          loading={isSubmitting || loading}
          variant="card"
          size="lg"
        />

        {/* Help Text */}
        <div className="mt-8 text-center">
          <Typography variant="small" className="text-muted-foreground">
            Your progress is automatically saved as you work. You can return to complete your portfolio anytime.
          </Typography>
        </div>

        {/* Step Icons for Visual Reference */}
        <div className="hidden md:flex justify-center items-center gap-8 mt-12 opacity-50">
          <div className="flex flex-col items-center gap-2">
            <User className="w-8 h-8" />
            <Typography variant="small">Personal</Typography>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex flex-col items-center gap-2">
            <Briefcase className="w-8 h-8" />
            <Typography variant="small">Skills</Typography>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex flex-col items-center gap-2">
            <FolderOpen className="w-8 h-8" />
            <Typography variant="small">Projects</Typography>
          </div>
          <div className="w-8 h-px bg-border" />
          <div className="flex flex-col items-center gap-2">
            <LinkIcon className="w-8 h-8" />
            <Typography variant="small">Social</Typography>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}