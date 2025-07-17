import type { PortfolioTemplate, ColorScheme } from "@/types/template";

// Color Schemes
export const colorSchemes: Record<string, ColorScheme[]> = {
  modern: [
    {
      id: "modern-blue",
      name: "Professional Blue",
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        accent: "#0ea5e9",
        background: "#ffffff",
        foreground: "#0f172a",
        muted: "#f1f5f9",
        border: "#e2e8f0",
        card: "#ffffff",
        cardForeground: "#0f172a",
        popover: "#ffffff",
        popoverForeground: "#0f172a",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        ring: "#2563eb",
      },
      gradients: {
        primary: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
        secondary: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)",
        accent: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
      },
    },
    {
      id: "modern-dark",
      name: "Modern Dark",
      colors: {
        primary: "#3b82f6",
        secondary: "#6b7280",
        accent: "#10b981",
        background: "#0f172a",
        foreground: "#f8fafc",
        muted: "#1e293b",
        border: "#334155",
        card: "#1e293b",
        cardForeground: "#f8fafc",
        popover: "#1e293b",
        popoverForeground: "#f8fafc",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        ring: "#3b82f6",
      },
    },
  ],
  creative: [
    {
      id: "creative-purple",
      name: "Creative Purple",
      colors: {
        primary: "#7c3aed",
        secondary: "#a855f7",
        accent: "#ec4899",
        background: "#fefce8",
        foreground: "#581c87",
        muted: "#faf5ff",
        border: "#e879f9",
        card: "#ffffff",
        cardForeground: "#581c87",
        popover: "#ffffff",
        popoverForeground: "#581c87",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        ring: "#7c3aed",
      },
      gradients: {
        primary: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
        secondary: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
        accent: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
      },
    },
    {
      id: "creative-rainbow",
      name: "Rainbow Gradient",
      colors: {
        primary: "#f59e0b",
        secondary: "#ef4444",
        accent: "#8b5cf6",
        background: "#fffbeb",
        foreground: "#92400e",
        muted: "#fef3c7",
        border: "#fbbf24",
        card: "#ffffff",
        cardForeground: "#92400e",
        popover: "#ffffff",
        popoverForeground: "#92400e",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        ring: "#f59e0b",
      },
    },
  ],
  minimal: [
    {
      id: "minimal-mono",
      name: "Monochrome",
      colors: {
        primary: "#000000",
        secondary: "#6b7280",
        accent: "#374151",
        background: "#ffffff",
        foreground: "#111827",
        muted: "#f9fafb",
        border: "#e5e7eb",
        card: "#ffffff",
        cardForeground: "#111827",
        popover: "#ffffff",
        popoverForeground: "#111827",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        ring: "#000000",
      },
    },
    {
      id: "minimal-warm",
      name: "Warm Minimal",
      colors: {
        primary: "#92400e",
        secondary: "#a3a3a3",
        accent: "#d97706",
        background: "#fffbeb",
        foreground: "#451a03",
        muted: "#fef3c7",
        border: "#fed7aa",
        card: "#ffffff",
        cardForeground: "#451a03",
        popover: "#ffffff",
        popoverForeground: "#451a03",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        ring: "#92400e",
      },
    },
  ],
  developer: [
    {
      id: "developer-terminal",
      name: "Terminal Green",
      colors: {
        primary: "#10b981",
        secondary: "#6b7280",
        accent: "#06b6d4",
        background: "#0f172a",
        foreground: "#00ff41",
        muted: "#1e293b",
        border: "#334155",
        card: "#111827",
        cardForeground: "#00ff41",
        popover: "#111827",
        popoverForeground: "#00ff41",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        ring: "#10b981",
      },
    },
    {
      id: "developer-github",
      name: "GitHub Style",
      colors: {
        primary: "#238636",
        secondary: "#656d76",
        accent: "#0969da",
        background: "#ffffff",
        foreground: "#24292f",
        muted: "#f6f8fa",
        border: "#d0d7de",
        card: "#ffffff",
        cardForeground: "#24292f",
        popover: "#ffffff",
        popoverForeground: "#24292f",
        destructive: "#cf222e",
        destructiveForeground: "#ffffff",
        ring: "#238636",
      },
    },
  ],
  academic: [
    {
      id: "academic-classic",
      name: "Academic Blue",
      colors: {
        primary: "#1e40af",
        secondary: "#64748b",
        accent: "#0f766e",
        background: "#ffffff",
        foreground: "#1e293b",
        muted: "#f8fafc",
        border: "#cbd5e1",
        card: "#ffffff",
        cardForeground: "#1e293b",
        popover: "#ffffff",
        popoverForeground: "#1e293b",
        destructive: "#dc2626",
        destructiveForeground: "#ffffff",
        ring: "#1e40af",
      },
    },
  ],
};

// Portfolio Templates
export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description: "Clean, corporate design with sidebar navigation. Perfect for business professionals and consultants.",
    category: "modern",
    features: [
      "Sidebar Navigation",
      "Professional Layout",
      "Contact Form",
      "Skills Visualization",
      "Project Gallery",
      "Responsive Design"
    ],
    preview: {
      thumbnail: "/templates/modern-professional/thumbnail.jpg",
      images: {
        desktop: "/templates/modern-professional/desktop.jpg",
        tablet: "/templates/modern-professional/tablet.jpg",
        mobile: "/templates/modern-professional/mobile.jpg",
      },
    },
    config: {
      layout: {
        type: "sidebar",
        sidebarPosition: "left",
        maxWidth: "1200px",
        spacing: "normal",
      },
      sections: {
        hero: { isVisible: true, order: 1, style: "minimal" },
        about: { isVisible: true, order: 2, style: "default" },
        experience: { isVisible: true, order: 3, style: "card" },
        skills: { isVisible: true, order: 4, style: "highlighted" },
        projects: { isVisible: true, order: 5, style: "card" },
        contact: { isVisible: true, order: 6, style: "default" },
      },
      typography: {
        headingFont: "Inter",
        bodyFont: "Inter",
        scale: "normal",
      },
      components: {
        navigation: {
          type: "vertical",
          position: "left",
          style: "minimal",
        },
        hero: {
          layout: "left",
          backgroundType: "solid",
          showAvatar: true,
          showSocialLinks: true,
          animationType: "fade",
        },
        cards: {
          style: "elevated",
          borderRadius: "medium",
          shadow: "medium",
          hover: "lift",
        },
        buttons: {
          style: "solid",
          size: "medium",
          borderRadius: "medium",
        },
      },
      responsive: {
        breakpoints: {
          mobile: "768px",
          tablet: "1024px",
          desktop: "1200px",
        },
        behavior: {
          navigation: "collapse",
          sidebar: "overlay",
          cards: "stack",
        },
      },
    },
    colorSchemes: colorSchemes.modern || [],
    layoutOptions: [
      {
        id: "sidebar-left",
        name: "Left Sidebar",
        description: "Navigation on the left side",
        preview: "/layouts/sidebar-left.jpg",
        config: {
          layout: {
            type: "sidebar",
            sidebarPosition: "left",
            maxWidth: "1200px",
            spacing: "normal"
          },
        },
      },
      {
        id: "sidebar-right",
        name: "Right Sidebar",
        description: "Navigation on the right side",
        preview: "/layouts/sidebar-right.jpg",
        config: {
          layout: {
            type: "sidebar",
            sidebarPosition: "right",
            maxWidth: "1200px",
            spacing: "normal"
          },
        },
      },
    ],
    customization: {
      colors: {
        canCustomize: true,
        presets: colorSchemes.modern || [],
      },
      typography: {
        canCustomize: true,
        fontOptions: [
          {
            id: "inter",
            name: "Inter",
            family: "Inter, sans-serif",
            weights: [400, 500, 600, 700],
            category: "sans-serif",
            preview: "Modern and clean",
          },
          {
            id: "roboto",
            name: "Roboto",
            family: "Roboto, sans-serif",
            weights: [300, 400, 500, 700],
            category: "sans-serif",
            preview: "Professional and readable",
          },
        ],
      },
      layout: {
        canCustomize: true,
        options: [
          {
            id: "sidebar-left",
            name: "Left Sidebar",
            description: "Navigation on the left side",
            preview: "/layouts/sidebar-left.jpg",
            config: {
              layout: {
                type: "sidebar",
                sidebarPosition: "left",
                maxWidth: "1200px",
                spacing: "normal"
              },
            },
          },
        ],
      },
      sections: {
        canReorder: true,
        canToggleVisibility: true,
        canCustomizeStyle: true,
      },
    },
    isPopular: true,
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    description: "Bold, colorful design perfect for designers, artists, and creative professionals.",
    category: "creative",
    features: [
      "Vibrant Colors",
      "Animation Effects",
      "Portfolio Gallery",
      "Creative Layouts",
      "Interactive Elements",
      "Mobile Optimized"
    ],
    preview: {
      thumbnail: "/templates/creative-portfolio/thumbnail.jpg",
      images: {
        desktop: "/templates/creative-portfolio/desktop.jpg",
        tablet: "/templates/creative-portfolio/tablet.jpg",
        mobile: "/templates/creative-portfolio/mobile.jpg",
      },
    },
    config: {
      layout: {
        type: "header",
        headerStyle: "sticky",
        maxWidth: "1400px",
        spacing: "spacious",
      },
      sections: {
        hero: { isVisible: true, order: 1, style: "highlighted" },
        about: { isVisible: true, order: 2, style: "card" },
        projects: { isVisible: true, order: 3, style: "highlighted" },
        skills: { isVisible: true, order: 4, style: "default" },
        contact: { isVisible: true, order: 5, style: "highlighted" },
      },
      typography: {
        headingFont: "Poppins",
        bodyFont: "Open Sans",
        scale: "large",
      },
      components: {
        navigation: {
          type: "horizontal",
          position: "top",
          style: "pills",
        },
        hero: {
          layout: "centered",
          backgroundType: "gradient",
          showAvatar: true,
          showSocialLinks: true,
          animationType: "slide",
        },
        cards: {
          style: "flat",
          borderRadius: "large",
          shadow: "large",
          hover: "scale",
        },
        buttons: {
          style: "solid",
          size: "large",
          borderRadius: "full",
        },
      },
      responsive: {
        breakpoints: {
          mobile: "768px",
          tablet: "1024px",
          desktop: "1400px",
        },
        behavior: {
          navigation: "collapse",
          sidebar: "hide",
          cards: "carousel",
        },
      },
    },
    colorSchemes: colorSchemes.creative || [],
    layoutOptions: [
      {
        id: "header-sticky",
        name: "Sticky Header",
        description: "Header stays at top when scrolling",
        preview: "/layouts/header-sticky.jpg",
        config: {
          layout: {
            type: "header",
            headerStyle: "sticky",
            maxWidth: "1400px",
            spacing: "spacious"
          },
        },
      },
      {
        id: "header-fixed",
        name: "Fixed Header",
        description: "Header always visible",
        preview: "/layouts/header-fixed.jpg",
        config: {
          layout: {
            type: "header",
            headerStyle: "fixed",
            maxWidth: "1400px",
            spacing: "spacious"
          },
        },
      },
    ],
    customization: {
      colors: {
        canCustomize: true,
        presets: colorSchemes.creative || [],
      },
      typography: {
        canCustomize: true,
        fontOptions: [
          {
            id: "poppins",
            name: "Poppins",
            family: "Poppins, sans-serif",
            weights: [300, 400, 500, 600, 700],
            category: "sans-serif",
            preview: "Modern and friendly",
          },
          {
            id: "montserrat",
            name: "Montserrat",
            family: "Montserrat, sans-serif",
            weights: [300, 400, 500, 600, 700],
            category: "sans-serif",
            preview: "Bold and creative",
          },
        ],
      },
      layout: {
        canCustomize: true,
        options: [
          {
            id: "header-sticky",
            name: "Sticky Header",
            description: "Header stays at top when scrolling",
            preview: "/layouts/header-sticky.jpg",
            config: {
              layout: {
                type: "header",
                headerStyle: "sticky",
                maxWidth: "1400px",
                spacing: "spacious"
              },
            },
          },
        ],
      },
      sections: {
        canReorder: true,
        canToggleVisibility: true,
        canCustomizeStyle: true,
      },
    },
    isNew: true,
  },
  {
    id: "developer-focus",
    name: "Developer Focus",
    description: "Code-focused layout with project emphasis. Ideal for software developers and engineers.",
    category: "developer",
    features: [
      "Code Syntax Highlighting",
      "GitHub Integration",
      "Project Showcase",
      "Technical Skills",
      "Terminal Theme",
      "Developer Tools"
    ],
    preview: {
      thumbnail: "/templates/developer-focus/thumbnail.jpg",
      images: {
        desktop: "/templates/developer-focus/desktop.jpg",
        tablet: "/templates/developer-focus/tablet.jpg",
        mobile: "/templates/developer-focus/mobile.jpg",
      },
    },
    config: {
      layout: {
        type: "split",
        maxWidth: "1300px",
        spacing: "compact",
      },
      sections: {
        hero: { isVisible: true, order: 1, style: "minimal" },
        projects: { isVisible: true, order: 2, style: "highlighted" },
        skills: { isVisible: true, order: 3, style: "card" },
        experience: { isVisible: true, order: 4, style: "default" },
        contact: { isVisible: true, order: 5, style: "minimal" },
      },
      typography: {
        headingFont: "JetBrains Mono",
        bodyFont: "Source Code Pro",
        monoFont: "Fira Code",
        scale: "normal",
      },
      components: {
        navigation: {
          type: "horizontal",
          position: "top",
          style: "underline",
        },
        hero: {
          layout: "split",
          backgroundType: "pattern",
          showAvatar: true,
          showSocialLinks: true,
          animationType: "typewriter",
        },
        cards: {
          style: "outlined",
          borderRadius: "small",
          shadow: "small",
          hover: "glow",
        },
        buttons: {
          style: "outline",
          size: "medium",
          borderRadius: "small",
        },
      },
      responsive: {
        breakpoints: {
          mobile: "768px",
          tablet: "1024px",
          desktop: "1300px",
        },
        behavior: {
          navigation: "scroll",
          sidebar: "hide",
          cards: "grid",
        },
      },
    },
    colorSchemes: colorSchemes.developer || [],
    layoutOptions: [
      {
        id: "split-layout",
        name: "Split Layout",
        description: "Two-column layout",
        preview: "/layouts/split-layout.jpg",
        config: {
          layout: {
            type: "split",
            maxWidth: "1300px",
            spacing: "compact"
          },
        },
      },
    ],
    customization: {
      colors: {
        canCustomize: true,
        presets: colorSchemes.developer || [],
      },
      typography: {
        canCustomize: true,
        fontOptions: [
          {
            id: "jetbrains-mono",
            name: "JetBrains Mono",
            family: "JetBrains Mono, monospace",
            weights: [400, 500, 600, 700],
            category: "monospace",
            preview: "Perfect for code",
          },
          {
            id: "fira-code",
            name: "Fira Code",
            family: "Fira Code, monospace",
            weights: [300, 400, 500, 600],
            category: "monospace",
            preview: "Developer favorite",
          },
        ],
      },
      layout: {
        canCustomize: false,
        options: [],
      },
      sections: {
        canReorder: true,
        canToggleVisibility: true,
        canCustomizeStyle: false,
      },
    },
    isPopular: true,
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Simple, typography-focused design that lets your content shine. Perfect for writers and consultants.",
    category: "minimal",
    features: [
      "Typography Focus",
      "Clean Design",
      "Fast Loading",
      "Accessibility",
      "Print Friendly",
      "SEO Optimized"
    ],
    preview: {
      thumbnail: "/templates/minimal-clean/thumbnail.jpg",
      images: {
        desktop: "/templates/minimal-clean/desktop.jpg",
        tablet: "/templates/minimal-clean/tablet.jpg",
        mobile: "/templates/minimal-clean/mobile.jpg",
      },
    },
    config: {
      layout: {
        type: "single-column",
        maxWidth: "800px",
        spacing: "normal",
      },
      sections: {
        hero: { isVisible: true, order: 1, style: "minimal" },
        about: { isVisible: true, order: 2, style: "minimal" },
        experience: { isVisible: true, order: 3, style: "minimal" },
        skills: { isVisible: true, order: 4, style: "minimal" },
        projects: { isVisible: true, order: 5, style: "minimal" },
        contact: { isVisible: true, order: 6, style: "minimal" },
      },
      typography: {
        headingFont: "Playfair Display",
        bodyFont: "Source Serif Pro",
        scale: "normal",
      },
      components: {
        navigation: {
          type: "horizontal",
          position: "top",
          style: "minimal",
        },
        hero: {
          layout: "centered",
          backgroundType: "solid",
          showAvatar: false,
          showSocialLinks: true,
          animationType: "fade",
        },
        cards: {
          style: "minimal",
          borderRadius: "none",
          shadow: "none",
          hover: "none",
        },
        buttons: {
          style: "link",
          size: "medium",
          borderRadius: "none",
        },
      },
      responsive: {
        breakpoints: {
          mobile: "768px",
          tablet: "1024px",
          desktop: "1200px",
        },
        behavior: {
          navigation: "stack",
          sidebar: "hide",
          cards: "stack",
        },
      },
    },
    colorSchemes: colorSchemes.minimal || [],
    layoutOptions: [
      {
        id: "single-column",
        name: "Single Column",
        description: "Centered single column layout",
        preview: "/layouts/single-column.jpg",
        config: {
          layout: {
            type: "single-column",
            maxWidth: "800px",
            spacing: "normal"
          },
        },
      },
    ],
    customization: {
      colors: {
        canCustomize: true,
        presets: colorSchemes.minimal || [],
      },
      typography: {
        canCustomize: true,
        fontOptions: [
          {
            id: "playfair",
            name: "Playfair Display",
            family: "Playfair Display, serif",
            weights: [400, 500, 600, 700],
            category: "serif",
            preview: "Elegant and readable",
          },
          {
            id: "crimson",
            name: "Crimson Text",
            family: "Crimson Text, serif",
            weights: [400, 600],
            category: "serif",
            preview: "Classic serif",
          },
        ],
      },
      layout: {
        canCustomize: false,
        options: [],
      },
      sections: {
        canReorder: true,
        canToggleVisibility: true,
        canCustomizeStyle: false,
      },
    },
  },
  {
    id: "academic-research",
    name: "Academic Research",
    description: "Publication and research-focused layout. Perfect for academics, researchers, and scientists.",
    category: "academic",
    features: [
      "Publication List",
      "Research Focus",
      "Citation Format",
      "Academic CV",
      "Conference Papers",
      "Professional Network"
    ],
    preview: {
      thumbnail: "/templates/academic-research/thumbnail.jpg",
      images: {
        desktop: "/templates/academic-research/desktop.jpg",
        tablet: "/templates/academic-research/tablet.jpg",
        mobile: "/templates/academic-research/mobile.jpg",
      },
    },
    config: {
      layout: {
        type: "header",
        headerStyle: "static",
        maxWidth: "1000px",
        spacing: "normal",
      },
      sections: {
        hero: { isVisible: true, order: 1, style: "default" },
        about: { isVisible: true, order: 2, style: "default" },
        education: { isVisible: true, order: 3, style: "card" },
        experience: { isVisible: true, order: 4, style: "default" },
        projects: { isVisible: true, order: 5, style: "card" },
        contact: { isVisible: true, order: 6, style: "default" },
      },
      typography: {
        headingFont: "Crimson Text",
        bodyFont: "Source Serif Pro",
        scale: "normal",
      },
      components: {
        navigation: {
          type: "horizontal",
          position: "top",
          style: "background",
        },
        hero: {
          layout: "left",
          backgroundType: "solid",
          showAvatar: true,
          showSocialLinks: true,
          animationType: "none",
        },
        cards: {
          style: "outlined",
          borderRadius: "small",
          shadow: "small",
          hover: "none",
        },
        buttons: {
          style: "outline",
          size: "medium",
          borderRadius: "small",
        },
      },
      responsive: {
        breakpoints: {
          mobile: "768px",
          tablet: "1024px",
          desktop: "1200px",
        },
        behavior: {
          navigation: "collapse",
          sidebar: "hide",
          cards: "stack",
        },
      },
    },
    colorSchemes: colorSchemes.academic || [],
    layoutOptions: [
      {
        id: "academic-header",
        name: "Academic Header",
        description: "Traditional academic layout",
        preview: "/layouts/academic-header.jpg",
        config: {
          layout: {
            type: "header",
            headerStyle: "static",
            maxWidth: "1000px",
            spacing: "normal"
          },
        },
      },
    ],
    customization: {
      colors: {
        canCustomize: true,
        presets: colorSchemes.academic || [],
      },
      typography: {
        canCustomize: true,
        fontOptions: [
          {
            id: "crimson",
            name: "Crimson Text",
            family: "Crimson Text, serif",
            weights: [400, 600],
            category: "serif",
            preview: "Academic standard",
          },
          {
            id: "eb-garamond",
            name: "EB Garamond",
            family: "EB Garamond, serif",
            weights: [400, 500, 600],
            category: "serif",
            preview: "Classic elegance",
          },
        ],
      },
      layout: {
        canCustomize: false,
        options: [],
      },
      sections: {
        canReorder: true,
        canToggleVisibility: true,
        canCustomizeStyle: false,
      },
    },
  },
];

// Default preview data for templates
export const defaultPreviewData = {
  personalInfo: {
    name: "Alex Johnson",
    title: "Full Stack Developer",
    bio: "Passionate developer with 5+ years of experience creating innovative web applications. I love turning complex problems into simple, beautiful solutions.",
    avatar: "/preview/avatar.jpg",
    location: "San Francisco, CA",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
  },
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      duration: "2022 - Present",
      description: "Lead development of scalable web applications using React, Node.js, and cloud technologies.",
    },
    {
      title: "Frontend Developer",
      company: "Digital Solutions Co.",
      duration: "2020 - 2022",
      description: "Developed responsive user interfaces and improved application performance by 40%.",
    },
    {
      title: "Junior Developer",
      company: "StartUp Labs",
      duration: "2019 - 2020",
      description: "Built and maintained web applications while learning modern development practices.",
    },
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      school: "University of California",
      year: "2019",
    },
    {
      degree: "Full Stack Web Development",
      school: "Coding Bootcamp",
      year: "2018",
    },
  ],
  skills: [
    { name: "JavaScript", level: 90, category: "Programming" },
    { name: "React", level: 85, category: "Frontend" },
    { name: "Node.js", level: 80, category: "Backend" },
    { name: "TypeScript", level: 75, category: "Programming" },
    { name: "Python", level: 70, category: "Programming" },
    { name: "AWS", level: 65, category: "Cloud" },
  ],
  projects: [
    {
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration and admin dashboard.",
      image: "/preview/project1.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://example.com/project1",
    },
    {
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates.",
      image: "/preview/project2.jpg",
      technologies: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
      link: "https://example.com/project2",
    },
    {
      title: "Weather Dashboard",
      description: "Interactive weather dashboard with data visualization and forecasting.",
      image: "/preview/project3.jpg",
      technologies: ["React", "D3.js", "Weather API", "Chart.js"],
      link: "https://example.com/project3",
    },
  ],
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/alexjohnson" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
    { platform: "Twitter", url: "https://twitter.com/alexjohnson" },
    { platform: "Portfolio", url: "https://alexjohnson.dev" },
  ],
};