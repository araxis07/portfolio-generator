import { NextResponse, type NextRequest } from 'next/server';
import JSZip from 'jszip';
import { minify } from 'html-minifier-terser';
import { AssetManager } from '@/lib/asset-manager';
import { portfolioTemplates, defaultPreviewData } from '@/data/templates';
import type { Portfolio, PortfolioSection } from '@/types';
import type { PortfolioTemplate } from '@/types/template';

// In-memory storage for export progress (in production, use Redis or database)
const exportProgress = new Map<string, {
  status: 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  downloadUrl?: string;
  error?: string;
}>();

// Store generated files temporarily (in production, use cloud storage)
const exportFiles = new Map<string, Buffer>();

interface ExportRequest {
  portfolioId: string;
  format: 'html' | 'pdf' | 'json';
  options: {
    includeAssets: boolean;
    minifyCode: boolean;
    optimizeImages: boolean;
    includeSourceMaps: boolean;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ExportRequest = await request.json();
    const { portfolioId, format, options } = body;

    // Generate unique export ID
    const exportId = `export_${portfolioId}_${Date.now()}`;

    // Initialize progress tracking
    exportProgress.set(exportId, {
      status: 'processing',
      progress: 0,
      message: 'Starting export...'
    });

    // Start background processing
    processExportInBackground(exportId, portfolioId, format, options);

    return NextResponse.json({ exportId });
  } catch (error) {
    console.error('Export initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to start export' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const exportId = searchParams.get('exportId');
  const action = searchParams.get('action');

  if (!exportId) {
    return NextResponse.json(
      { error: 'Export ID is required' },
      { status: 400 }
    );
  }

  if (action === 'download') {
    const fileBuffer = exportFiles.get(exportId);
    if (!fileBuffer) {
      return NextResponse.json(
        { error: 'Export file not found' },
        { status: 404 }
      );
    }

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', `attachment; filename="portfolio-${exportId}.zip"`);

    return new NextResponse(fileBuffer as BodyInit, { headers });
  }

  // Return progress status
  const progress = exportProgress.get(exportId);
  if (!progress) {
    return NextResponse.json(
      { error: 'Export not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(progress);
}

async function processExportInBackground(
  exportId: string,
  portfolioId: string,
  format: string,
  options: ExportRequest['options']
) {
  try {
    // Update progress: Loading portfolio data
    updateProgress(exportId, 10, 'Loading portfolio data...');

    const portfolio = await loadPortfolioData(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    // Update progress: Validating portfolio
    updateProgress(exportId, 20, 'Validating portfolio...');
    
    const validation = validatePortfolio(portfolio);
    if (!validation.isValid) {
      throw new Error(`Portfolio validation failed: ${validation.errors.join(', ')}`);
    }

    // Update progress: Generating HTML
    updateProgress(exportId, 40, 'Generating HTML...');
    
    const html = await generateCompleteHTML(portfolio, options);

    // Update progress: Processing assets
    updateProgress(exportId, 60, 'Processing assets...');
    
    const assetManager = new AssetManager();
    const assets = await assetManager.processPortfolioAssets(portfolio, {
      optimizeImages: options.optimizeImages
    });

    // Update progress: Creating export package
    updateProgress(exportId, 80, 'Creating export package...');
    
    const exportPackage = await createExportPackage(html, assets, format, options);

    // Update progress: Finalizing
    updateProgress(exportId, 100, 'Export completed!');

    // Store the generated file
    exportFiles.set(exportId, exportPackage);

    // Mark as completed
    exportProgress.set(exportId, {
      status: 'completed',
      progress: 100,
      message: 'Export completed successfully!',
      downloadUrl: `/api/generate?exportId=${exportId}&action=download`
    });

  } catch (error) {
    console.error('Export processing error:', error);
    exportProgress.set(exportId, {
      status: 'error',
      progress: 0,
      message: 'Export failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function updateProgress(exportId: string, progress: number, message: string) {
  const current = exportProgress.get(exportId);
  if (current) {
    exportProgress.set(exportId, {
      ...current,
      progress,
      message
    });
  }
}

async function loadPortfolioData(portfolioId: string): Promise<Portfolio | null> {
  try {
    // In a real app, this would load from database
    // For now, we'll simulate loading from localStorage-like storage
    const portfolios = JSON.parse(process.env.PORTFOLIO_DATA || '[]');
    return portfolios.find((p: Portfolio) => p.id === portfolioId) || null;
  } catch {
    return null;
  }
}

function validatePortfolio(portfolio: Portfolio): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!portfolio.title) {
    errors.push('Portfolio title is required');
  }

  if (!portfolio.sections || portfolio.sections.length === 0) {
    errors.push('At least one section is required');
  }

  // Check for essential sections
  const hasHeroSection = portfolio.sections.some(section => section.type === 'hero');
  const hasContentSection = portfolio.sections.some(section => 
    ['about', 'experience', 'projects', 'skills'].includes(section.type)
  );

  if (!hasHeroSection) {
    errors.push('Hero section is required');
  }

  if (!hasContentSection) {
    errors.push('At least one content section (about, experience, projects, or skills) is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function generateCompleteHTML(
  portfolio: Portfolio,
  options: ExportRequest['options']
): Promise<string> {
  // Find the template or use default
  const template = portfolioTemplates.find(t => t.id === getTemplateIdFromPortfolio()) || portfolioTemplates[0]!;
  
  // Extract data from portfolio sections
  const portfolioData = extractPortfolioData(portfolio);
  
  // Generate the complete HTML structure
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolio.title || 'Portfolio'}</title>
    <meta name="description" content="${portfolio.description || 'Professional Portfolio'}">
    <meta name="author" content="${portfolioData.personalInfo?.name || 'Portfolio Owner'}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        ${generateTemplateStyles(template, portfolio.theme)}
        
        /* Print styles */
        @media print {
            .no-print { display: none !important; }
            body { font-size: 12pt; line-height: 1.4; }
            .page-break { page-break-before: always; }
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body class="font-inter bg-white text-gray-900">
    ${generateTemplateHTML(template, portfolioData)}
    
    <!-- Analytics (optional) -->
    ${options.includeSourceMaps ? '<!-- Source maps included -->' : ''}
    
    <script>
        // Add any interactive functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Add print functionality
            const printBtn = document.querySelector('.print-btn');
            if (printBtn) {
                printBtn.addEventListener('click', () => window.print());
            }
        });
    </script>
</body>
</html>`;

  if (options.minifyCode) {
    return await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    });
  }

  return html;
}

function getTemplateIdFromPortfolio(): string {
  // Try to extract template ID from portfolio settings or theme
  // For now, we'll use a default template
  return 'modern-professional';
}

function extractPortfolioData(portfolio: Portfolio) {
  const data: any = {
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    projects: [],
    socialLinks: []
  };

  // Extract data from portfolio sections
  portfolio.sections.forEach((section: PortfolioSection) => {
    switch (section.type) {
      case 'hero':
        data.personalInfo = {
          name: section.content.name || 'Portfolio Owner',
          title: section.content.title || 'Professional',
          bio: section.content.bio || section.content.description || 'Professional portfolio',
          avatar: section.content.avatar,
          location: section.content.location,
          email: section.content.email,
          phone: section.content.phone
        };
        break;
      
      case 'about':
        if (!data.personalInfo.bio) {
          data.personalInfo.bio = section.content.description || section.content.bio;
        }
        break;
      
      case 'experience':
        if (Array.isArray(section.content.items)) {
          data.experience = section.content.items.map((item: any) => ({
            title: item.position || item.title,
            company: item.company || item.organization,
            duration: `${item.startDate || ''} - ${item.endDate || 'Present'}`,
            description: item.description || ''
          }));
        }
        break;
      
      case 'education':
        if (Array.isArray(section.content.items)) {
          data.education = section.content.items.map((item: any) => ({
            degree: item.degree || item.title,
            school: item.school || item.institution,
            year: item.year || item.endDate || ''
          }));
        }
        break;
      
      case 'skills':
        if (Array.isArray(section.content.items)) {
          data.skills = section.content.items.map((item: any) => ({
            name: item.name || item.skill,
            level: item.level || 80,
            category: item.category || 'General'
          }));
        }
        break;
      
      case 'projects':
        if (Array.isArray(section.content.items)) {
          data.projects = section.content.items.map((item: any) => ({
            title: item.name || item.title,
            description: item.description || '',
            image: item.image || item.thumbnail,
            technologies: item.technologies || item.tech || [],
            link: item.liveUrl || item.url || item.link
          }));
        }
        break;
      
      case 'contact':
        if (section.content.socialLinks) {
          data.socialLinks = section.content.socialLinks;
        }
        break;
    }
  });

  // Use default data if sections are empty
  if (!data.personalInfo.name) {
    data.personalInfo = defaultPreviewData.personalInfo;
  }
  if (data.experience.length === 0) {
    data.experience = defaultPreviewData.experience;
  }
  if (data.projects.length === 0) {
    data.projects = defaultPreviewData.projects;
  }
  if (data.skills.length === 0) {
    data.skills = defaultPreviewData.skills;
  }

  return data;
}

function generateTemplateStyles(template: PortfolioTemplate, theme: any): string {
  const colors = theme?.colors || {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b'
  };

  return `
    :root {
      --color-primary: ${colors.primary};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
    }
    
    .font-inter { font-family: 'Inter', sans-serif; }
    
    .bg-primary { background-color: var(--color-primary); }
    .text-primary { color: var(--color-primary); }
    .border-primary { border-color: var(--color-primary); }
    
    .bg-secondary { background-color: var(--color-secondary); }
    .text-secondary { color: var(--color-secondary); }
    
    .bg-accent { background-color: var(--color-accent); }
    .text-accent { color: var(--color-accent); }
    
    /* Template-specific styles */
    ${template.id === 'modern-professional' ? `
      .hero-section { background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); }
      .card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    ` : ''}
    
    ${template.id === 'creative-portfolio' ? `
      .creative-header { background: radial-gradient(circle, var(--color-primary), var(--color-secondary)); }
      .project-card { transform: perspective(1000px) rotateY(0deg); transition: transform 0.3s; }
      .project-card:hover { transform: perspective(1000px) rotateY(5deg); }
    ` : ''}
    
    ${template.id === 'developer-focus' ? `
      .code-block { background: #1e293b; color: #e2e8f0; font-family: 'Fira Code', monospace; }
      .tech-badge { background: var(--color-primary); color: white; }
    ` : ''}
  `;
}

function generateTemplateHTML(template: PortfolioTemplate, portfolioData: any): string {
  switch (template.id) {
    case 'modern-professional':
      return generateModernProfessionalHTML(portfolioData);
    case 'creative-portfolio':
      return generateCreativePortfolioHTML(portfolioData);
    case 'developer-focus':
      return generateDeveloperFocusHTML(portfolioData);
    case 'minimal-clean':
      return generateMinimalCleanHTML(portfolioData);
    case 'academic-research':
      return generateAcademicResearchHTML(portfolioData);
    default:
      return generateModernProfessionalHTML(portfolioData);
  }
}

function generateModernProfessionalHTML(data: any): string {
  const { personalInfo, experience, projects, skills } = data;
  
  return `
    <div class="min-h-screen">
      <!-- Header -->
      <header class="hero-section text-white py-20">
        <div class="container mx-auto px-6 text-center">
          <h1 class="text-5xl font-bold mb-4">${personalInfo?.name || 'Your Name'}</h1>
          <p class="text-xl mb-6">${personalInfo?.title || 'Professional Title'}</p>
          <p class="text-lg max-w-2xl mx-auto">${personalInfo?.bio || 'Professional summary goes here.'}</p>
          <div class="mt-8 space-x-4">
            ${personalInfo?.email ? `<a href="mailto:${personalInfo.email}" class="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Contact Me</a>` : ''}
          </div>
        </div>
      </header>

      <!-- Experience Section -->
      ${experience?.length ? `
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12">Experience</h2>
          <div class="max-w-4xl mx-auto space-y-8">
            ${experience.map((exp: any) => `
              <div class="card bg-white p-6 rounded-lg">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-xl font-semibold">${exp.title}</h3>
                    <p class="text-primary font-medium">${exp.company}</p>
                  </div>
                  <span class="text-secondary">${exp.duration}</span>
                </div>
                <p class="text-gray-700">${exp.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Projects Section -->
      ${projects?.length ? `
      <section class="py-16">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12">Projects</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${projects.map((project: any) => `
              <div class="card bg-white p-6 rounded-lg border">
                <h3 class="text-xl font-semibold mb-3">${project.title}</h3>
                <p class="text-gray-700 mb-4">${project.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  ${project.technologies?.map((tech: string) => `
                    <span class="bg-primary text-white px-3 py-1 rounded-full text-sm">${tech}</span>
                  `).join('') || ''}
                </div>
                ${project.link ? `<a href="${project.link}" class="text-primary hover:underline">View Project →</a>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Skills Section -->
      ${skills?.length ? `
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold text-center mb-12">Skills</h2>
          <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            ${skills.map((skill: any) => `
              <div class="flex justify-between items-center">
                <span class="font-medium">${skill.name}</span>
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full" style="width: ${skill.level}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-6 text-center">
          <h3 class="text-2xl font-bold mb-4">Get In Touch</h3>
          <p class="mb-6">Let's discuss how we can work together.</p>
          <div class="space-x-6">
            ${personalInfo?.email ? `<a href="mailto:${personalInfo.email}" class="hover:text-primary transition-colors">${personalInfo.email}</a>` : ''}
            ${personalInfo?.phone ? `<a href="tel:${personalInfo.phone}" class="hover:text-primary transition-colors">${personalInfo.phone}</a>` : ''}
          </div>
        </div>
      </footer>
    </div>
  `;
}

function generateCreativePortfolioHTML(data: any): string {
  const { personalInfo, projects } = data;
  
  return `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <!-- Creative Header -->
      <header class="creative-header text-white py-24 relative overflow-hidden">
        <div class="container mx-auto px-6 text-center relative z-10">
          <div class="w-32 h-32 rounded-full bg-white/20 mx-auto mb-6 flex items-center justify-center">
            <span class="text-4xl font-bold">${personalInfo?.name?.charAt(0) || 'A'}</span>
          </div>
          <h1 class="text-6xl font-bold mb-4">${personalInfo?.name || 'Creative Professional'}</h1>
          <p class="text-2xl mb-8">${personalInfo?.title || 'Creative Designer'}</p>
          <div class="max-w-3xl mx-auto">
            <p class="text-lg leading-relaxed">${personalInfo?.bio || 'Passionate about creating beautiful and functional designs.'}</p>
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-pink-600/80"></div>
      </header>

      <!-- Projects Showcase -->
      ${projects?.length ? `
      <section class="py-20">
        <div class="container mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">Featured Work</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${projects.map((project: any) => `
              <div class="project-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div class="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <span class="text-white text-2xl font-bold">${project.title?.charAt(0) || 'P'}</span>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-3 text-gray-800">${project.title}</h3>
                  <p class="text-gray-600 mb-4">${project.description}</p>
                  <div class="flex flex-wrap gap-2 mb-4">
                    ${project.technologies?.map((tech: string) => `
                      <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">${tech}</span>
                    `).join('') || ''}
                  </div>
                  ${project.link ? `<a href="${project.link}" class="text-purple-600 hover:text-purple-800 font-semibold">Explore →</a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}
    </div>
  `;
}

function generateDeveloperFocusHTML(data: any): string {
  const { personalInfo, skills } = data;
  
  return `
    <div class="min-h-screen bg-gray-900 text-gray-100">
      <!-- Terminal-style Header -->
      <header class="py-16 border-b border-gray-700">
        <div class="container mx-auto px-6">
          <div class="code-block p-6 rounded-lg mb-8">
            <div class="flex items-center mb-4">
              <div class="flex space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span class="ml-4 text-sm text-gray-400">terminal</span>
            </div>
            <div class="font-mono">
              <p class="text-green-400">$ whoami</p>
              <p class="text-blue-400">${personalInfo?.name || 'developer'}</p>
              <p class="text-green-400">$ cat about.txt</p>
              <p>${personalInfo?.bio || 'Full-stack developer passionate about clean code and innovative solutions.'}</p>
            </div>
          </div>
          
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">&lt;${personalInfo?.name || 'Developer'} /&gt;</h1>
            <p class="text-xl text-gray-300">${personalInfo?.title || 'Software Engineer'}</p>
          </div>
        </div>
      </header>

      <!-- Tech Stack -->
      ${skills?.length ? `
      <section class="py-16">
        <div class="container mx-auto px-6">
          <h2 class="text-3xl font-bold mb-12 text-center">
            <span class="text-blue-400">const</span> techStack = {
          </h2>
          <div class="max-w-4xl mx-auto space-y-6">
            <div class="code-block p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-4 text-yellow-400">skills: [</h3>
              <div class="ml-6 flex flex-wrap gap-3">
                ${skills.map((skill: any, index: number, array: any[]) => `
                  <span class="tech-badge px-3 py-1 rounded text-sm">'${skill.name}'${index < array.length - 1 ? ',' : ''}</span>
                `).join('')}
              </div>
              <p class="text-yellow-400 mt-2">]</p>
            </div>
          </div>
          <p class="text-center text-2xl mt-8 text-yellow-400">};</p>
        </div>
      </section>
      ` : ''}
    </div>
  `;
}

function generateMinimalCleanHTML(data: any): string {
  const { personalInfo, experience, projects } = data;
  
  return `
    <div class="min-h-screen bg-white">
      <!-- Minimal Header -->
      <header class="py-20 border-b border-gray-200">
        <div class="container mx-auto px-6 max-w-4xl">
          <h1 class="text-4xl font-light mb-4 text-gray-900">${personalInfo?.name || 'Your Name'}</h1>
          <p class="text-xl text-gray-600 mb-6">${personalInfo?.title || 'Professional Title'}</p>
          <p class="text-lg text-gray-700 leading-relaxed max-w-2xl">${personalInfo?.bio || 'A brief professional summary.'}</p>
        </div>
      </header>

      <!-- Clean Content -->
      <main class="py-16">
        <div class="container mx-auto px-6 max-w-4xl space-y-16">
          
          ${experience?.length ? `
          <section>
            <h2 class="text-2xl font-light mb-8 text-gray-900 border-b border-gray-200 pb-2">Experience</h2>
            <div class="space-y-8">
              ${experience.map((exp: any) => `
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="text-lg font-medium text-gray-900">${exp.title}</h3>
                    <p class="text-gray-600">${exp.company}</p>
                    <p class="text-gray-700 mt-2">${exp.description}</p>
                  </div>
                  <span class="text-sm text-gray-500 ml-6">${exp.duration}</span>
                </div>
              `).join('')}
            </div>
          </section>
          ` : ''}

          ${projects?.length ? `
          <section>
            <h2 class="text-2xl font-light mb-8 text-gray-900 border-b border-gray-200 pb-2">Selected Work</h2>
            <div class="space-y-8">
              ${projects.map((project: any) => `
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">${project.title}</h3>
                  <p class="text-gray-700 mb-3">${project.description}</p>
                  ${project.technologies?.length ? `
                    <div class="flex flex-wrap gap-2 mb-2">
                      ${project.technologies.map((tech: string) => `
                        <span class="text-sm text-gray-600 border border-gray-300 px-2 py-1 rounded">${tech}</span>
                      `).join('')}
                    </div>
                  ` : ''}
                  ${project.link ? `<a href="${project.link}" class="text-gray-900 hover:underline text-sm">View Project →</a>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
          ` : ''}

        </div>
      </main>
    </div>
  `;
}

function generateAcademicResearchHTML(data: any): string {
  const { personalInfo, experience, projects } = data;
  
  return `
    <div class="min-h-screen bg-gray-50">
      <!-- Academic Header -->
      <header class="bg-white py-16 border-b border-gray-200">
        <div class="container mx-auto px-6 max-w-5xl">
          <div class="text-center">
            <h1 class="text-4xl font-serif font-bold mb-4 text-gray-900">${personalInfo?.name || 'Dr. Academic Name'}</h1>
            <p class="text-xl text-gray-600 mb-2">${personalInfo?.title || 'Research Professor'}</p>
            <div class="mt-6 max-w-3xl mx-auto">
              <p class="text-gray-700 leading-relaxed">${personalInfo?.bio || 'Research interests and academic background.'}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Academic Content -->
      <main class="py-16">
        <div class="container mx-auto px-6 max-w-5xl">
          
          ${experience?.length ? `
          <section class="mb-16">
            <h2 class="text-2xl font-serif font-bold mb-8 text-gray-900">Experience</h2>
            <div class="bg-white p-8 rounded-lg shadow-sm">
              <div class="space-y-6">
                ${experience.map((exp: any) => `
                  <div class="border-l-4 border-blue-500 pl-6">
                    <h3 class="font-semibold text-gray-900 mb-2">${exp.title}</h3>
                    <p class="text-gray-600 mb-1">${exp.company}</p>
                    <p class="text-gray-600 italic">${exp.duration}</p>
                    <p class="text-gray-700 mt-2">${exp.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
          ` : ''}

          ${projects?.length ? `
          <section class="mb-16">
            <h2 class="text-2xl font-serif font-bold mb-8 text-gray-900">Research Projects</h2>
            <div class="grid md:grid-cols-2 gap-8">
              ${projects.map((project: any) => `
                <div class="bg-white p-6 rounded-lg shadow-sm">
                  <h3 class="text-xl font-semibold mb-3 text-gray-900">${project.title}</h3>
                  <p class="text-gray-700 mb-4">${project.description}</p>
                  ${project.link ? `<a href="${project.link}" class="text-blue-600 hover:underline">View Project →</a>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
          ` : ''}

        </div>
      </main>
    </div>
  `;
}

async function createExportPackage(
  html: string,
  assets: any,
  format: string,
  options: ExportRequest['options']
): Promise<Buffer> {
  const zip = new JSZip();

  // Add main HTML file
  zip.file('index.html', html);

  // Add assets if included
  if (options.includeAssets && assets) {
    // Add CSS files
    if (assets.styles) {
      zip.file('styles/main.css', assets.styles);
    }

    // Add images
    if (assets.images && assets.images.length > 0) {
      const imagesFolder = zip.folder('images');
      for (const image of assets.images) {
        if (image.data && imagesFolder) {
          imagesFolder.file(image.filename, image.data);
        }
      }
    }

    // Add fonts
    if (assets.fonts && assets.fonts.length > 0) {
      const fontsFolder = zip.folder('fonts');
      for (const font of assets.fonts) {
        if (font.data && fontsFolder) {
          fontsFolder.file(font.filename, font.data);
        }
      }
    }
  }

  // Add README file
  const readme = `# Portfolio Export

This is an exported portfolio package generated by the Portfolio Generator.

## Files:
- index.html - Main portfolio file
- styles/ - CSS stylesheets (if included)
- images/ - Image assets (if included)
- fonts/ - Font files (if included)

## Usage:
1. Open index.html in a web browser to view the portfolio
2. Upload all files to a web server for online hosting
3. The portfolio is fully self-contained and ready to deploy

Generated on: ${new Date().toISOString()}
Format: ${format}
`;

  zip.file('README.md', readme);

  // Generate ZIP buffer
  return await zip.generateAsync({ type: 'nodebuffer' });
}