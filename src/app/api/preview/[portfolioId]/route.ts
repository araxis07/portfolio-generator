import { type NextRequest, NextResponse } from "next/server";
import { portfolioStorage } from "@/lib/storage";
import { portfolioTemplates, defaultPreviewData } from "@/data/templates";

export async function GET(
  request: NextRequest,
  { params }: { params: { portfolioId: string } }
) {
  try {
    const { portfolioId } = params;
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("template");

    // Get portfolio data
    const portfolio = portfolioStorage.getById(portfolioId);
    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Get template configuration
    const template = portfolioTemplates.find(
      (t) => t.id === (templateId || portfolio.theme.id)
    );
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Prepare portfolio data for rendering
    const portfolioData = {
      personalInfo: {
        name: portfolio.sections.find(s => s.type === "hero")?.content?.name || defaultPreviewData.personalInfo.name,
        title: portfolio.sections.find(s => s.type === "hero")?.content?.title || defaultPreviewData.personalInfo.title,
        bio: portfolio.sections.find(s => s.type === "about")?.content?.bio || defaultPreviewData.personalInfo.bio,
        avatar: portfolio.sections.find(s => s.type === "hero")?.content?.avatar || defaultPreviewData.personalInfo.avatar,
        location: portfolio.sections.find(s => s.type === "contact")?.content?.location || defaultPreviewData.personalInfo.location,
        email: portfolio.sections.find(s => s.type === "contact")?.content?.email || defaultPreviewData.personalInfo.email,
        phone: portfolio.sections.find(s => s.type === "contact")?.content?.phone || defaultPreviewData.personalInfo.phone,
      },
      experience: portfolio.sections.find(s => s.type === "experience")?.content?.items || defaultPreviewData.experience,
      education: portfolio.sections.find(s => s.type === "education")?.content?.items || defaultPreviewData.education,
      skills: portfolio.sections.find(s => s.type === "skills")?.content?.items || defaultPreviewData.skills,
      projects: portfolio.sections.find(s => s.type === "projects")?.content?.items || defaultPreviewData.projects,
      socialLinks: portfolio.settings.socialLinks || defaultPreviewData.socialLinks,
    };

    // Generate the HTML content
    const htmlContent = generatePreviewHTML(template, portfolioData, portfolio.theme);

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Preview generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}

function generatePreviewHTML(template: any, data: any, theme: any): string {
  // Generate CSS variables from theme
  const cssVariables = `
    :root {
      --primary: ${theme.colors?.primary || '#2563eb'};
      --secondary: ${theme.colors?.secondary || '#64748b'};
      --accent: ${theme.colors?.accent || '#0ea5e9'};
      --background: ${theme.colors?.background || '#ffffff'};
      --foreground: ${theme.colors?.foreground || '#0f172a'};
      --muted: ${theme.colors?.muted || '#f1f5f9'};
      --border: ${theme.colors?.border || '#e2e8f0'};
      --card: ${theme.colors?.card || '#ffffff'};
      --card-foreground: ${theme.colors?.cardForeground || '#0f172a'};
      --popover: ${theme.colors?.popover || '#ffffff'};
      --popover-foreground: ${theme.colors?.popoverForeground || '#0f172a'};
      --destructive: ${theme.colors?.destructive || '#ef4444'};
      --destructive-foreground: ${theme.colors?.destructiveForeground || '#ffffff'};
      --ring: ${theme.colors?.ring || '#2563eb'};
      
      --heading-font: ${theme.fonts?.heading || 'Inter, sans-serif'};
      --body-font: ${theme.fonts?.body || 'Inter, sans-serif'};
      --mono-font: ${theme.fonts?.mono || 'JetBrains Mono, monospace'};
      
      --border-radius: ${theme.borderRadius || '0.5rem'};
    }
  `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.personalInfo.name} - Portfolio Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Source+Code+Pro:wght@300;400;500;600&family=Crimson+Text:wght@400;600&family=Source+Serif+Pro:wght@400;600&family=Fira+Code:wght@300;400;500;600&family=Montserrat:wght@300;400;500;600;700&family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    ${cssVariables}
    
    body {
      font-family: var(--body-font);
      background-color: var(--background);
      color: var(--foreground);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--heading-font);
      font-weight: 600;
      line-height: 1.2;
    }
    
    .template-container {
      min-height: 100vh;
      width: 100%;
    }
    
    /* Template-specific styles */
    ${getTemplateStyles(template.id)}
  </style>
</head>
<body>
  <div class="template-container">
    ${generateTemplateHTML(template.id, data)}
  </div>
  
  <script>
    // Add any interactive functionality here
    document.addEventListener('DOMContentLoaded', function() {
      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
      
      // Add scroll effects
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.parallax');
        parallax.forEach(element => {
          const speed = element.dataset.speed || 0.5;
          element.style.transform = \`translateY(\${scrolled * speed}px)\`;
        });
      });
    });
  </script>
</body>
</html>
  `;
}

function getTemplateStyles(templateId: string): string {
  const baseStyles = `
    .card {
      background-color: var(--card);
      color: var(--card-foreground);
      border: 1px solid var(--border);
      border-radius: var(--border-radius);
      padding: 1.5rem;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    
    .btn-primary {
      background-color: var(--primary);
      color: white;
    }
    
    .btn-primary:hover {
      opacity: 0.9;
    }
    
    .btn-outline {
      background-color: transparent;
      color: var(--primary);
      border: 1px solid var(--primary);
    }
    
    .btn-outline:hover {
      background-color: var(--primary);
      color: white;
    }
    
    .section {
      padding: 3rem 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .grid {
      display: grid;
      gap: 1.5rem;
    }
    
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    
    @media (max-width: 768px) {
      .grid-cols-2, .grid-cols-3 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
    }
  `;

  const templateSpecificStyles = {
    "modern-professional": `
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 280px;
        height: 100vh;
        background-color: var(--card);
        border-right: 1px solid var(--border);
        padding: 2rem;
        overflow-y: auto;
      }
      
      .main-content {
        margin-left: 280px;
        padding: 2rem;
      }
      
      @media (max-width: 1024px) {
        .sidebar {
          position: relative;
          width: 100%;
          height: auto;
        }
        .main-content {
          margin-left: 0;
        }
      }
    `,
    "creative-portfolio": `
      .hero-gradient {
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
      }
      
      .project-card {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        transition: transform 0.3s ease;
      }
      
      .project-card:hover {
        transform: scale(1.05);
      }
    `,
    "developer-focus": `
      .terminal-bg {
        background-color: #0f172a;
        color: #00ff41;
        font-family: var(--mono-font);
      }
      
      .code-block {
        background-color: #1e293b;
        border: 1px solid #334155;
        border-radius: 0.5rem;
        padding: 1rem;
        font-family: var(--mono-font);
        overflow-x: auto;
      }
    `,
    "minimal-clean": `
      .minimal-section {
        border-bottom: 1px solid var(--border);
        padding: 2rem 0;
      }
      
      .minimal-section:last-child {
        border-bottom: none;
      }
      
      .typography-focus h1 {
        font-size: 3rem;
        font-weight: 400;
        margin-bottom: 1rem;
      }
      
      .typography-focus h2 {
        font-size: 2rem;
        font-weight: 500;
        margin-bottom: 1.5rem;
      }
    `,
    "academic-research": `
      .publication-item {
        border-left: 3px solid var(--primary);
        padding-left: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .citation {
        font-style: italic;
        color: var(--muted-foreground);
        font-size: 0.9rem;
      }
      
      .academic-header {
        text-align: center;
        padding: 3rem 0;
        border-bottom: 2px solid var(--border);
      }
    `
  };

  return baseStyles + (templateSpecificStyles[templateId as keyof typeof templateSpecificStyles] || "");
}

function generateTemplateHTML(templateId: string, data: any): string {
  const templates = {
    "modern-professional": generateModernProfessionalHTML,
    "creative-portfolio": generateCreativePortfolioHTML,
    "developer-focus": generateDeveloperFocusHTML,
    "minimal-clean": generateMinimalCleanHTML,
    "academic-research": generateAcademicResearchHTML,
  };

  const generator = templates[templateId as keyof typeof templates];
  return generator ? generator(data) : generateDefaultHTML(data);
}

function generateDefaultHTML(data: any): string {
  return `
    <div class="container py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">${data.personalInfo.name}</h1>
        <p class="text-xl text-gray-600">${data.personalInfo.title}</p>
      </div>
      
      <div class="max-w-3xl mx-auto">
        <p class="text-lg leading-relaxed mb-8">${data.personalInfo.bio}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-2xl font-bold mb-4">Contact</h2>
            <p>Email: ${data.personalInfo.email}</p>
            <p>Phone: ${data.personalInfo.phone}</p>
            <p>Location: ${data.personalInfo.location}</p>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold mb-4">Social Links</h2>
            ${data.socialLinks.map((link: any) => `
              <p><a href="${link.url}" target="_blank" class="text-blue-600 hover:underline">${link.platform}</a></p>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateModernProfessionalHTML(data: any): string {
  return `
    <div class="sidebar">
      <div class="text-center mb-8">
        <img src="${data.personalInfo.avatar}" alt="${data.personalInfo.name}" class="w-24 h-24 rounded-full mx-auto mb-4" style="width: 96px; height: 96px; border-radius: 50%; object-fit: cover;">
        <h1 class="text-2xl font-bold mb-2">${data.personalInfo.name}</h1>
        <p class="text-lg text-gray-600">${data.personalInfo.title}</p>
      </div>
      
      <nav class="space-y-2">
        <a href="#about" class="block py-2 px-4 rounded hover:bg-gray-100">About</a>
        <a href="#experience" class="block py-2 px-4 rounded hover:bg-gray-100">Experience</a>
        <a href="#skills" class="block py-2 px-4 rounded hover:bg-gray-100">Skills</a>
        <a href="#projects" class="block py-2 px-4 rounded hover:bg-gray-100">Projects</a>
        <a href="#contact" class="block py-2 px-4 rounded hover:bg-gray-100">Contact</a>
      </nav>
      
      <div class="mt-8">
        <div class="flex flex-col space-y-2">
          ${data.socialLinks.map((link: any) => `
            <a href="${link.url}" target="_blank" class="text-gray-600 hover:text-primary">
              ${link.platform}
            </a>
          `).join('')}
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <section id="about" class="section">
        <h2 class="text-3xl font-bold mb-6">About Me</h2>
        <div class="card">
          <p class="text-lg leading-relaxed">${data.personalInfo.bio}</p>
        </div>
      </section>
      
      <section id="experience" class="section">
        <h2 class="text-3xl font-bold mb-6">Experience</h2>
        <div class="space-y-6">
          ${data.experience.map((exp: any) => `
            <div class="card">
              <h3 class="text-xl font-semibold mb-2">${exp.title}</h3>
              <p class="text-primary font-medium mb-2">${exp.company}</p>
              <p class="text-gray-600 mb-3">${exp.duration}</p>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </div>
      </section>
      
      <section id="skills" class="section">
        <h2 class="text-3xl font-bold mb-6">Skills</h2>
        <div class="grid grid-cols-2 gap-4">
          ${data.skills.map((skill: any) => `
            <div class="card">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium">${skill.name}</span>
                <span class="text-sm text-gray-600">${skill.level}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full" style="width: ${skill.level}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      
      <section id="projects" class="section">
        <h2 class="text-3xl font-bold mb-6">Projects</h2>
        <div class="grid grid-cols-1 gap-6">
          ${data.projects.map((project: any) => `
            <div class="card">
              <h3 class="text-xl font-semibold mb-3">${project.title}</h3>
              <p class="mb-4">${project.description}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                ${project.technologies.map((tech: string) => `
                  <span class="px-3 py-1 bg-gray-100 text-sm rounded-full">${tech}</span>
                `).join('')}
              </div>
              <a href="${project.link}" target="_blank" class="btn btn-primary">View Project</a>
            </div>
          `).join('')}
        </div>
      </section>
      
      <section id="contact" class="section">
        <h2 class="text-3xl font-bold mb-6">Contact</h2>
        <div class="card">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="font-medium">Email</p>
              <p class="text-gray-600">${data.personalInfo.email}</p>
            </div>
            <div>
              <p class="font-medium">Phone</p>
              <p class="text-gray-600">${data.personalInfo.phone}</p>
            </div>
            <div>
              <p class="font-medium">Location</p>
              <p class="text-gray-600">${data.personalInfo.location}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}

function generateCreativePortfolioHTML(data: any): string {
  return `
    <header class="hero-gradient text-white py-20">
      <div class="container text-center">
        <img src="${data.personalInfo.avatar}" alt="${data.personalInfo.name}" class="w-32 h-32 rounded-full mx-auto mb-6" style="width: 128px; height: 128px; border-radius: 50%; object-fit: cover;">
        <h1 class="text-5xl font-bold mb-4">${data.personalInfo.name}</h1>
        <p class="text-2xl mb-8">${data.personalInfo.title}</p>
        <a href="#projects" class="btn btn-outline text-white border-white hover:bg-white hover:text-primary">View My Work</a>
      </div>
    </header>
    
    <section id="about" class="section">
      <div class="container">
        <h2 class="text-4xl font-bold text-center mb-12">About Me</h2>
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-xl leading-relaxed">${data.personalInfo.bio}</p>
        </div>
      </div>
    </section>
    
    <section id="projects" class="section bg-gray-50">
      <div class="container">
        <h2 class="text-4xl font-bold text-center mb-12">Featured Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${data.projects.map((project: any) => `
            <div class="project-card bg-white rounded-lg overflow-hidden shadow-lg">
              <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
              <div class="p-6">
                <h3 class="text-xl font-semibold mb-3">${project.title}</h3>
                <p class="text-gray-600 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  ${project.technologies.map((tech: string) => `
                    <span class="px-2 py-1 bg-primary text-white text-sm rounded">${tech}</span>
                  `).join('')}
                </div>
                <a href="${project.link}" target="_blank" class="btn btn-primary">View Project</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <section id="skills" class="section">
      <div class="container">
        <h2 class="text-4xl font-bold text-center mb-12">Skills & Expertise</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${data.skills.map((skill: any) => `
            <div class="text-center">
              <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold text-lg">${skill.level}%</span>
              </div>
              <h3 class="font-semibold">${skill.name}</h3>
              <p class="text-sm text-gray-600">${skill.category}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <section id="contact" class="section bg-primary text-white">
      <div class="container text-center">
        <h2 class="text-4xl font-bold mb-8">Let's Work Together</h2>
        <p class="text-xl mb-8">Ready to bring your ideas to life?</p>
        <div class="flex justify-center space-x-6">
          ${data.socialLinks.map((link: any) => `
            <a href="${link.url}" target="_blank" class="text-white hover:text-accent text-lg">${link.platform}</a>
          `).join('')}
        </div>
        <div class="mt-8">
          <p class="mb-2">${data.personalInfo.email}</p>
          <p>${data.personalInfo.phone}</p>
        </div>
      </div>
    </section>
  `;
}

function generateDeveloperFocusHTML(data: any): string {
  return `
    <div class="terminal-bg min-h-screen">
      <div class="container py-12">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">${data.personalInfo.name}</h1>
          <p class="text-xl mb-6">${data.personalInfo.title}</p>
          <div class="code-block inline-block">
            <code>$ whoami<br/>${data.personalInfo.name.toLowerCase().replace(' ', '_')}</code>
          </div>
        </div>
        
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">// About</h2>
          <div class="code-block">
            <pre><code>const developer = {
  name: "${data.personalInfo.name}",
  title: "${data.personalInfo.title}",
  bio: "${data.personalInfo.bio}",
  location: "${data.personalInfo.location}"
};</code></pre>
          </div>
        </section>
        
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">// Projects</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${data.projects.map((project: any) => `
              <div class="code-block">
                <h3 class="text-lg font-semibold mb-3">${project.title}</h3>
                <p class="mb-4">${project.description}</p>
                <div class="mb-4">
                  <span class="text-accent">Technologies:</span> [${project.technologies.map((tech: string) => `"${tech}"`).join(', ')}]
                </div>
                <a href="${project.link}" target="_blank" class="btn btn-outline">View Code</a>
              </div>
            `).join('')}
          </div>
        </section>
        
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6">// Skills</h2>
          <div class="code-block">
            <pre><code>const skills = {
${data.skills.map((skill: any) => `  ${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}: ${skill.level}%`).join(',\n')}
};</code></pre>
          </div>
        </section>
        
        <section>
          <h2 class="text-2xl font-bold mb-6">// Contact</h2>
          <div class="code-block">
            <pre><code>const contact = {
  email: "${data.personalInfo.email}",
  phone: "${data.personalInfo.phone}",
  social: {
${data.socialLinks.map((link: any) => `    ${link.platform.toLowerCase()}: "${link.url}"`).join(',\n')}
  }
};</code></pre>
          </div>
        </section>
      </div>
    </div>
  `;
}

function generateMinimalCleanHTML(data: any): string {
  return `
    <div class="container max-w-4xl mx-auto py-12">
      <header class="text-center mb-16">
        <h1 class="typography-focus text-5xl font-light mb-4">${data.personalInfo.name}</h1>
        <p class="text-xl text-gray-600 mb-8">${data.personalInfo.title}</p>
        <div class="flex justify-center space-x-6">
          ${data.socialLinks.map((link: any) => `
            <a href="${link.url}" target="_blank" class="text-gray-600 hover:text-primary underline">${link.platform}</a>
          `).join('')}
        </div>
      </header>
      
      <section class="minimal-section">
        <h2 class="typography-focus text-3xl font-medium mb-6">About</h2>
        <p class="text-lg leading-relaxed max-w-3xl">${data.personalInfo.bio}</p>
      </section>
      
      <section class="minimal-section">
        <h2 class="typography-focus text-3xl font-medium mb-6">Experience</h2>
        <div class="space-y-8">
          ${data.experience.map((exp: any) => `
            <div>
              <h3 class="text-xl font-medium mb-2">${exp.title}</h3>
              <p class="text-gray-600 mb-1">${exp.company} • ${exp.duration}</p>
              <p class="leading-relaxed">${exp.description}</p>
            </div>
          `).join('')}
        </div>
      </section>
      
      <section class="minimal-section">
        <h2 class="typography-focus text-3xl font-medium mb-6">Projects</h2>
        <div class="space-y-8">
          ${data.projects.map((project: any) => `
            <div>
              <h3 class="text-xl font-medium mb-3">${project.title}</h3>
              <p class="leading-relaxed mb-4">${project.description}</p>
              <p class="text-sm text-gray-600 mb-3">
                <strong>Technologies:</strong> ${project.technologies.join(', ')}
              </p>
              <a href="${project.link}" target="_blank" class="underline hover:no-underline">View Project →</a>
            </div>
          `).join('')}
        </div>
      </section>
      
      <section class="minimal-section">
        <h2 class="typography-focus text-3xl font-medium mb-6">Contact</h2>
        <div class="space-y-2">
          <p><strong>Email:</strong> <a href="mailto:${data.personalInfo.email}" class="underline hover:no-underline">${data.personalInfo.email}</a></p>
          <p><strong>Phone:</strong> ${data.personalInfo.phone}</p>
          <p><strong>Location:</strong> ${data.personalInfo.location}</p>
        </div>
      </section>
    </div>
  `;
}

function generateAcademicResearchHTML(data: any): string {
  return `
    <div class="container max-w-5xl mx-auto">
      <header class="academic-header">
        <img src="${data.personalInfo.avatar}" alt="${data.personalInfo.name}" class="w-32 h-32 rounded-full mx-auto mb-6" style="width: 128px; height: 128px; border-radius: 50%; object-fit: cover;">
        <h1 class="text-4xl font-bold mb-2">${data.personalInfo.name}</h1>
        <p class="text-xl text-gray-600 mb-4">${data.personalInfo.title}</p>
        <p class="text-gray-600">${data.personalInfo.location}</p>
      </header>
      
      <div class="py-12">
        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">About</h2>
          <p class="text-lg leading-relaxed">${data.personalInfo.bio}</p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">Education</h2>
          <div class="space-y-6">
            ${data.education.map((edu: any) => `
              <div class="publication-item">
                <h3 class="text-lg font-semibold">${edu.degree}</h3>
                <p class="text-gray-600">${edu.school} • ${edu.year}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">Research Experience</h2>
          <div class="space-y-6">
            ${data.experience.map((exp: any) => `
              <div class="publication-item">
                <h3 class="text-lg font-semibold">${exp.title}</h3>
                <p class="text-gray-600 mb-2">${exp.company} • ${exp.duration}</p>
                <p class="leading-relaxed">${exp.description}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">Projects & Publications</h2>
          <div class="space-y-6">
            ${data.projects.map((project: any) => `
              <div class="publication-item">
                <h3 class="text-lg font-semibold mb-2">${project.title}</h3>
                <p class="leading-relaxed mb-3">${project.description}</p>
                <p class="citation">Technologies: ${project.technologies.join(', ')}</p>
                <a href="${project.link}" target="_blank" class="text-primary hover:underline">View Publication →</a>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">Skills & Expertise</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${data.skills.map((skill: any) => `
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="font-medium">${skill.name}</span>
                <span class="text-sm text-gray-600">${skill.category}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-6 border-b-2 border-primary pb-2">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="mb-2"><strong>Email:</strong> ${data.personalInfo.email}</p>
              <p class="mb-2"><strong>Phone:</strong> ${data.personalInfo.phone}</p>
              <p class="mb-2"><strong>Location:</strong> ${data.personalInfo.location}</p>
            </div>
            <div>
              <p class="mb-2"><strong>Professional Networks:</strong></p>
              ${data.socialLinks.map((link: any) => `
                <p><a href="${link.url}" target="_blank" class="text-primary hover:underline">${link.platform}</a></p>
              `).join('')}
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}