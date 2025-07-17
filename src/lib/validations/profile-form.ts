import { z } from "zod";

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  professionalTitle: z
    .string()
    .min(2, "Professional title must be at least 2 characters")
    .max(100, "Professional title must be less than 100 characters"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be less than 500 characters"),
  profilePhoto: z
    .object({
      id: z.string(),
      file: z.instanceof(File),
      name: z.string(),
      size: z.number(),
      type: z.string(),
      status: z.enum(["pending", "uploading", "success", "error"]),
      progress: z.number().optional(),
      error: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .regex(
      /^[\+]?[1-9][\d]{0,15}$/,
      "Please enter a valid phone number"
    )
    .optional()
    .or(z.literal("")),
});

// Step 2: Skills & Expertise Schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
  category: z.enum(["technical", "soft", "language", "other"]),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export const skillsExpertiseSchema = z.object({
  skills: z
    .array(skillSchema)
    .min(3, "Please add at least 3 skills")
    .max(20, "Maximum 20 skills allowed"),
});

// Step 3: Projects & Portfolio Schema
export const projectSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(2, "Project title must be at least 2 characters")
    .max(100, "Project title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Project description must be at least 10 characters")
    .max(300, "Project description must be less than 300 characters"),
  technologies: z.array(z.string()).min(1, "Please add at least one technology"),
  projectUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  image: z
    .object({
      id: z.string(),
      file: z.instanceof(File),
      name: z.string(),
      size: z.number(),
      type: z.string(),
      status: z.enum(["pending", "uploading", "success", "error"]),
      progress: z.number().optional(),
      error: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  order: z.number(),
});

export const projectsPortfolioSchema = z.object({
  projects: z
    .array(projectSchema)
    .min(1, "Please add at least one project")
    .max(10, "Maximum 10 projects allowed"),
});

// Step 4: Social Links & Contact Schema
export const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.string(),
  url: z.string().url("Please enter a valid URL"),
  label: z.string().optional(),
});

export const socialLinksContactSchema = z.object({
  linkedin: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Please enter a valid Twitter/X URL")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  behance: z
    .string()
    .url("Please enter a valid Behance URL")
    .optional()
    .or(z.literal("")),
  dribbble: z
    .string()
    .url("Please enter a valid Dribbble URL")
    .optional()
    .or(z.literal("")),
  customLinks: z.array(socialLinkSchema).max(5, "Maximum 5 custom links allowed"),
  contactPreferences: z.object({
    emailNotifications: z.boolean(),
    publicProfile: z.boolean(),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
  }),
  portfolioVisibility: z.enum(["public", "private", "unlisted"]),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms of service",
  }),
});

// Complete Profile Form Schema
export const completeProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  skillsExpertise: skillsExpertiseSchema,
  projectsPortfolio: projectsPortfolioSchema,
  socialLinksContact: socialLinksContactSchema,
});

// Type exports
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type SkillsExpertiseFormData = z.infer<typeof skillsExpertiseSchema>;
export type ProjectsPortfolioFormData = z.infer<typeof projectsPortfolioSchema>;
export type SocialLinksContactFormData = z.infer<typeof socialLinksContactSchema>;
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;

// Helper functions for form data transformation
export const createEmptyPersonalInfo = (): PersonalInfoFormData => ({
  fullName: "",
  professionalTitle: "",
  bio: "",
  profilePhoto: undefined,
  location: "",
  email: "",
  phone: "",
});

export const createEmptySkillsExpertise = (): SkillsExpertiseFormData => ({
  skills: [],
});

export const createEmptyProjectsPortfolio = (): ProjectsPortfolioFormData => ({
  projects: [],
});

export const createEmptySocialLinksContact = (): SocialLinksContactFormData => ({
  linkedin: "",
  github: "",
  twitter: "",
  website: "",
  behance: "",
  dribbble: "",
  customLinks: [],
  contactPreferences: {
    emailNotifications: true,
    publicProfile: true,
    showEmail: false,
    showPhone: false,
  },
  portfolioVisibility: "public" as const,
  termsAccepted: false,
});

export const createEmptyCompleteProfile = (): CompleteProfileFormData => ({
  personalInfo: createEmptyPersonalInfo(),
  skillsExpertise: createEmptySkillsExpertise(),
  projectsPortfolio: createEmptyProjectsPortfolio(),
  socialLinksContact: createEmptySocialLinksContact(),
});

// Skill categories and proficiency levels for form options
export const SKILL_CATEGORIES = [
  { value: "technical", label: "Technical Skills" },
  { value: "soft", label: "Soft Skills" },
  { value: "language", label: "Languages" },
  { value: "other", label: "Other" },
] as const;

export const PROFICIENCY_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
] as const;

export const PORTFOLIO_VISIBILITY_OPTIONS = [
  { value: "public", label: "Public - Anyone can view" },
  { value: "unlisted", label: "Unlisted - Only with link" },
  { value: "private", label: "Private - Only you can view" },
] as const;

// Common technology suggestions for projects
export const COMMON_TECHNOLOGIES = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Vue.js",
  "Angular",
  "Express.js",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Firebase",
  "AWS",
  "Docker",
  "Git",
  "GraphQL",
  "REST API",
  "Redux",
  "Zustand",
  "Prisma",
  "Supabase",
];

// Common skill suggestions
export const COMMON_SKILLS = {
  technical: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "HTML/CSS",
    "SQL",
    "Git",
    "Docker",
    "AWS",
    "MongoDB",
    "PostgreSQL",
  ],
  soft: [
    "Communication",
    "Leadership",
    "Problem Solving",
    "Team Collaboration",
    "Project Management",
    "Critical Thinking",
    "Creativity",
    "Adaptability",
    "Time Management",
    "Public Speaking",
  ],
  language: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Portuguese",
    "Italian",
    "Russian",
  ],
  other: [
    "Photography",
    "Design",
    "Writing",
    "Marketing",
    "Sales",
    "Customer Service",
    "Data Analysis",
    "Research",
    "Teaching",
    "Consulting",
  ],
};