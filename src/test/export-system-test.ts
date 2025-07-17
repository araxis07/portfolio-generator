/**
 * Export System Test Suite
 * 
 * This file contains comprehensive tests for the export functionality
 * across all portfolio templates and various configurations.
 */

import type { Portfolio, ThemeConfig, SectionSettings } from "@/types";

// Helper function to create section settings
const createSectionSettings = (): SectionSettings => ({
  backgroundColor: undefined,
  textColor: undefined,
  padding: undefined,
  margin: undefined,
  customCSS: undefined,
});

// Helper function to create theme config
const createThemeConfig = (id: string, name: string): ThemeConfig => ({
  id,
  name,
  colors: {
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#0ea5e9",
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f1f5f9",
    border: "#e2e8f0",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: "0.5rem",
});

// Test portfolio data for each template
export const testPortfolios: Record<string, Portfolio> = {
  "modern-professional": {
    id: "test-modern-professional",
    title: "John Smith - Business Professional",
    description: "Senior Business Analyst with expertise in data-driven solutions",
    theme: createThemeConfig("modern-professional", "Modern Professional"),
    sections: [
      {
        id: "hero",
        type: "hero",
        title: "Hero Section",
        isVisible: true,
        order: 1,
        settings: createSectionSettings(),
        content: {
          headline: "Business Intelligence Expert",
          subheadline: "Transforming data into strategic insights",
          ctaText: "View My Work",
          backgroundImage: "/test-assets/hero-bg.jpg",
        },
      },
      {
        id: "about",
        type: "about",
        title: "About Me",
        isVisible: true,
        order: 2,
        settings: createSectionSettings(),
        content: {
          text: "I specialize in business intelligence, data analysis, and strategic planning.",
        },
      },
      {
        id: "experience",
        type: "experience",
        title: "Professional Experience",
        isVisible: true,
        order: 3,
        settings: createSectionSettings(),
        content: {
          items: [
            {
              title: "Senior Business Analyst",
              company: "Fortune 500 Corp",
              duration: "2020 - Present",
              description: "Lead cross-functional teams in data analysis projects.",
              technologies: ["SQL", "Python", "Tableau", "Power BI"],
            },
          ],
        },
      },
      {
        id: "skills",
        type: "skills",
        title: "Core Skills",
        isVisible: true,
        order: 4,
        settings: createSectionSettings(),
        content: {
          categories: [
            {
              name: "Data Analysis",
              skills: [
                { name: "SQL", level: 95 },
                { name: "Python", level: 85 },
              ],
            },
          ],
        },
      },
      {
        id: "projects",
        type: "projects",
        title: "Key Projects",
        isVisible: true,
        order: 5,
        settings: createSectionSettings(),
        content: {
          items: [
            {
              title: "Sales Performance Dashboard",
              description: "Interactive dashboard tracking KPIs",
              image: "/test-assets/project-dashboard.jpg",
              technologies: ["Tableau", "SQL", "Python"],
              link: "https://example.com/dashboard",
            },
          ],
        },
      },
      {
        id: "contact",
        type: "contact",
        title: "Get In Touch",
        isVisible: true,
        order: 6,
        settings: createSectionSettings(),
        content: {
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          location: "New York, NY",
        },
      },
    ],
    settings: {
      isPublic: true,
      seoTitle: "John Smith - Business Analyst Portfolio",
      seoDescription: "Professional portfolio of John Smith, Senior Business Analyst.",
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com/in/johnsmith", isVisible: true },
        { platform: "GitHub", url: "https://github.com/johnsmith", isVisible: true },
      ],
      customDomain: undefined,
      analytics: {
        googleAnalyticsId: undefined,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  "creative-portfolio": {
    id: "test-creative-portfolio",
    title: "Sarah Chen - Creative Designer",
    description: "UI/UX Designer and Digital Artist",
    theme: createThemeConfig("creative-portfolio", "Creative Portfolio"),
    sections: [
      {
        id: "hero",
        type: "hero",
        title: "Hero Section",
        isVisible: true,
        order: 1,
        settings: createSectionSettings(),
        content: {
          headline: "Creative Designer",
          subheadline: "Bringing ideas to life through design",
          ctaText: "View Portfolio",
        },
      },
      {
        id: "about",
        type: "about",
        title: "About",
        isVisible: true,
        order: 2,
        settings: createSectionSettings(),
        content: {
          text: "I'm a creative designer with expertise in UI/UX design, branding, and digital art.",
        },
      },
      {
        id: "projects",
        type: "projects",
        title: "Featured Work",
        isVisible: true,
        order: 3,
        settings: createSectionSettings(),
        content: {
          items: [
            {
              title: "Mobile App Design",
              description: "Complete UI/UX design for a fitness tracking app",
              image: "/test-assets/mobile-app-design.jpg",
              technologies: ["Figma", "Sketch", "Principle"],
              link: "https://example.com/mobile-app",
            },
          ],
        },
      },
      {
        id: "contact",
        type: "contact",
        title: "Let's Work Together",
        isVisible: true,
        order: 4,
        settings: createSectionSettings(),
        content: {
          email: "sarah.chen@example.com",
          phone: "+1 (555) 987-6543",
          location: "Los Angeles, CA",
        },
      },
    ],
    settings: {
      isPublic: true,
      seoTitle: "Sarah Chen - Creative Designer Portfolio",
      seoDescription: "Creative portfolio of Sarah Chen, UI/UX Designer and Digital Artist.",
      socialLinks: [
        { platform: "Dribbble", url: "https://dribbble.com/sarahchen", isVisible: true },
        { platform: "Behance", url: "https://behance.net/sarahchen", isVisible: true },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  "developer-focus": {
    id: "test-developer-focus",
    title: "Alex Rodriguez - Full Stack Developer",
    description: "Senior Software Engineer specializing in modern web technologies",
    theme: createThemeConfig("developer-focus", "Developer Focus"),
    sections: [
      {
        id: "hero",
        type: "hero",
        title: "Hero Section",
        isVisible: true,
        order: 1,
        settings: createSectionSettings(),
        content: {
          headline: "Full Stack Developer",
          subheadline: "Building the future, one line of code at a time",
          ctaText: "View Projects",
        },
      },
      {
        id: "projects",
        type: "projects",
        title: "Featured Projects",
        isVisible: true,
        order: 2,
        settings: createSectionSettings(),
        content: {
          items: [
            {
              title: "Microservices Architecture",
              description: "Scalable microservices platform handling 1M+ requests/day",
              image: "/test-assets/microservices.jpg",
              technologies: ["Node.js", "Docker", "Kubernetes", "MongoDB"],
              link: "https://github.com/alexrodriguez/microservices",
              githubUrl: "https://github.com/alexrodriguez/microservices",
            },
          ],
        },
      },
      {
        id: "skills",
        type: "skills",
        title: "Technical Skills",
        isVisible: true,
        order: 3,
        settings: createSectionSettings(),
        content: {
          categories: [
            {
              name: "Frontend",
              skills: [
                { name: "React", level: 95 },
                { name: "TypeScript", level: 90 },
              ],
            },
          ],
        },
      },
      {
        id: "contact",
        type: "contact",
        title: "Get In Touch",
        isVisible: true,
        order: 4,
        settings: createSectionSettings(),
        content: {
          email: "alex.rodriguez@example.com",
          phone: "+1 (555) 456-7890",
          location: "Austin, TX",
        },
      },
    ],
    settings: {
      isPublic: true,
      seoTitle: "Alex Rodriguez - Full Stack Developer",
      seoDescription: "Portfolio of Alex Rodriguez, Senior Full Stack Developer.",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/alexrodriguez", isVisible: true },
        { platform: "LinkedIn", url: "https://linkedin.com/in/alexrodriguez", isVisible: true },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  "minimal-clean": {
    id: "test-minimal-clean",
    title: "Emma Thompson - Content Writer",
    description: "Professional writer and content strategist",
    theme: createThemeConfig("minimal-clean", "Minimal Clean"),
    sections: [
      {
        id: "hero",
        type: "hero",
        title: "Hero Section",
        isVisible: true,
        order: 1,
        settings: createSectionSettings(),
        content: {
          headline: "Content Writer & Strategist",
          subheadline: "Crafting compelling stories that connect and convert",
          ctaText: "Read My Work",
        },
      },
      {
        id: "about",
        type: "about",
        title: "About",
        isVisible: true,
        order: 2,
        settings: createSectionSettings(),
        content: {
          text: "I'm a content writer and strategist with over 7 years of experience.",
        },
      },
      {
        id: "contact",
        type: "contact",
        title: "Contact",
        isVisible: true,
        order: 3,
        settings: createSectionSettings(),
        content: {
          email: "emma.thompson@example.com",
          phone: "+1 (555) 234-5678",
          location: "Portland, OR",
        },
      },
    ],
    settings: {
      isPublic: true,
      seoTitle: "Emma Thompson - Content Writer & Strategist",
      seoDescription: "Professional portfolio of Emma Thompson, Content Writer and Strategist.",
      socialLinks: [
        { platform: "LinkedIn", url: "https://linkedin.com/in/emmathompson", isVisible: true },
        { platform: "Twitter", url: "https://twitter.com/emmathompson", isVisible: true },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  "academic-research": {
    id: "test-academic-research",
    title: "Dr. Michael Chen - Research Scientist",
    description: "Computer Science Researcher and Professor",
    theme: createThemeConfig("academic-research", "Academic Research"),
    sections: [
      {
        id: "hero",
        type: "hero",
        title: "Hero Section",
        isVisible: true,
        order: 1,
        settings: createSectionSettings(),
        content: {
          headline: "Dr. Michael Chen",
          subheadline: "Research Scientist & Professor of Computer Science",
          ctaText: "View Publications",
        },
      },
      {
        id: "about",
        type: "about",
        title: "About",
        isVisible: true,
        order: 2,
        settings: createSectionSettings(),
        content: {
          text: "I am a Professor of Computer Science with research interests in machine learning and AI.",
        },
      },
      {
        id: "education",
        type: "education",
        title: "Education",
        isVisible: true,
        order: 3,
        settings: createSectionSettings(),
        content: {
          items: [
            {
              degree: "Ph.D. in Computer Science",
              school: "Stanford University",
              year: "2008",
              description: "Dissertation: 'Novel Approaches to Deep Learning Optimization'",
            },
          ],
        },
      },
      {
        id: "contact",
        type: "contact",
        title: "Contact",
        isVisible: true,
        order: 4,
        settings: createSectionSettings(),
        content: {
          email: "m.chen@university.edu",
          phone: "+1 (617) 555-0123",
          location: "Cambridge, MA",
          office: "Maxwell Dworkin 123, Harvard University",
        },
      },
    ],
    settings: {
      isPublic: true,
      seoTitle: "Dr. Michael Chen - Research Scientist & Professor",
      seoDescription: "Academic portfolio of Dr. Michael Chen, Computer Science Researcher.",
      socialLinks: [
        { platform: "Google Scholar", url: "https://scholar.google.com/citations?user=mchen", isVisible: true },
        { platform: "ResearchGate", url: "https://researchgate.net/profile/Michael-Chen", isVisible: true },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// Export test configurations
export const exportTestConfigurations = [
  {
    name: "HTML Export - All Templates",
    description: "Test HTML export functionality across all 5 templates",
    format: "html" as const,
    options: {
      includeAssets: true,
      minifyHtml: true,
      optimizeImages: true,
      generateSitemap: true,
    },
    templates: Object.keys(testPortfolios),
  },
  {
    name: "PDF Export - Selected Templates",
    description: "Test PDF export for business-focused templates",
    format: "pdf" as const,
    options: {
      pageSize: "A4",
      orientation: "portrait",
      includeImages: true,
      highQuality: true,
    },
    templates: ["modern-professional", "minimal-clean", "academic-research"],
  },
  {
    name: "JSON Export - All Templates",
    description: "Test JSON export for data portability",
    format: "json" as const,
    options: {
      includeMetadata: true,
      prettyPrint: true,
      validateSchema: true,
    },
    templates: Object.keys(testPortfolios),
  },
];

// Test asset files (mock data for testing)
export const testAssets = {
  images: [
    "/test-assets/hero-bg.jpg",
    "/test-assets/project-dashboard.jpg",
    "/test-assets/mobile-app-design.jpg",
    "/test-assets/microservices.jpg",
  ],
  fonts: [
    "/fonts/Inter-Regular.woff2",
    "/fonts/Inter-Medium.woff2",
    "/fonts/Inter-Bold.woff2",
    "/fonts/JetBrains-Mono-Regular.woff2",
  ],
  styles: [
    "/styles/globals.css",
    "/styles/templates/modern-professional.css",
    "/styles/templates/creative-portfolio.css",
    "/styles/templates/developer-focus.css",
    "/styles/templates/minimal-clean.css",
    "/styles/templates/academic-research.css",
  ],
};

// Test validation functions
export const validateExportOutput = {
  html: (zipContent: any) => {
    const requiredFiles = [
      "index.html",
      "assets/styles/main.css",
      "assets/js/main.js",
      "README.md",
    ];
    
    return requiredFiles.every(file => zipContent.files[file]);
  },
  
  pdf: (pdfBuffer: Buffer) => {
    // Basic PDF validation - check for PDF header
    return pdfBuffer.toString('ascii', 0, 4) === '%PDF';
  },
  
  json: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      return data.title && data.sections && data.theme;
    } catch {
      return false;
    }
  },
};

// Performance benchmarks
export const performanceBenchmarks = {
  maxExportTime: {
    html: 30000, // 30 seconds
    pdf: 45000,  // 45 seconds
    json: 5000,  // 5 seconds
  },
  maxFileSize: {
    html: 50 * 1024 * 1024, // 50MB
    pdf: 10 * 1024 * 1024,  // 10MB
    json: 1 * 1024 * 1024,   // 1MB
  },
};

// Error scenarios to test
export const errorTestCases = [
  {
    name: "Invalid Portfolio ID",
    portfolioId: "non-existent-id",
    expectedError: "Portfolio not found",
  },
  {
    name: "Missing Required Fields",
    portfolio: {
      ...testPortfolios["modern-professional"],
      title: "", // Empty required field
    },
    expectedError: "Validation failed",
  },
  {
    name: "Invalid Template ID",
    portfolio: {
      ...testPortfolios["modern-professional"],
      theme: {
        ...createThemeConfig("non-existent-template", "Invalid Template"),
      },
    },
    expectedError: "Template not found",
  },
];

/**
 * Test runner function to execute export tests
 */
export async function runExportTests() {
  const results = {
    passed: 0,
    failed: 0,
    errors: [] as string[],
  };

  console.log("🚀 Starting Export System Tests...\n");

  // Test each template with HTML export
  for (const templateId of Object.keys(testPortfolios)) {
    console.log(`📋 Testing ${templateId} template...`);
    
    try {
      const portfolio = testPortfolios[templateId];
      if (!portfolio) {
        throw new Error(`Portfolio not found for template: ${templateId}`);
      }
      
      // Test HTML export
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          format: 'html',
          options: {
            includeAssets: true,
            minifyHtml: true,
            optimizeImages: true,
          },
        }),
      });

      if (response.ok) {
        await response.json();
        console.log(`✅ ${templateId}: Export initiated successfully`);
        results.passed++;
      } else {
        const error = await response.text();
        console.log(`❌ ${templateId}: Export failed - ${error}`);
        results.failed++;
        results.errors.push(`${templateId}: ${error}`);
      }
    } catch (error) {
      console.log(`❌ ${templateId}: Test error - ${error}`);
      results.failed++;
      results.errors.push(`${templateId}: ${error}`);
    }
  }

  console.log("\n📊 Test Results:");
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log("\n🔍 Errors:");
    results.errors.forEach(error => console.log(`  - ${error}`));
  }

  return results;
}

export default {
  testPortfolios,
  exportTestConfigurations,
  testAssets,
  validateExportOutput,
  performanceBenchmarks,
  errorTestCases,
  runExportTests,
};