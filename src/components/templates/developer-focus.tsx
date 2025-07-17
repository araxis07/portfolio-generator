"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TemplateProps } from "./types";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Terminal,
  Code,
  GitBranch,
  Database,
  Server,
  Cpu,
  FileCode,
  Zap,
  Star,
  GitFork,
  Download,
} from "lucide-react";

export const DeveloperFocusTemplate: React.FC<TemplateProps> = ({
  data,
  customization,
  mode = "desktop",
  className,
}) => {
  const { personalInfo, experience, education, skills, projects, socialLinks } = data;

  // Get section visibility and order
  const getSectionConfig = (sectionKey: string) => {
    return customization.sections[sectionKey] || {
      isVisible: true,
      order: 0,
      style: "default",
    };
  };

  // Social link icons
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "twitter":
        return Twitter;
      default:
        return Globe;
    }
  };

  // Skill category icons
  const getSkillIcon = (category: string) => {
    const icons = {
      Programming: Code,
      Frontend: FileCode,
      Backend: Server,
      Database: Database,
      Cloud: Cpu,
      default: Terminal,
    };
    return icons[category as keyof typeof icons] || icons.default;
  };

  // Terminal-style command prompt
  const TerminalPrompt = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <span className="text-gray-400">terminal</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-blue-400">$</span>
        <span>{children}</span>
        <span className="animate-pulse">|</span>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "min-h-screen bg-background",
        mode === "mobile" && "max-w-sm mx-auto",
        mode === "tablet" && "max-w-2xl mx-auto",
        className
      )}
      style={{
        fontFamily: customization.typography.bodyFont,
      }}
    >
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary-foreground" />
              </div>
              <Typography variant="h4" className="font-mono">
                {personalInfo.name.toLowerCase().replace(" ", "_")}
              </Typography>
            </div>

            {mode !== "mobile" && (
              <div className="flex items-center gap-6 font-mono text-sm">
                {["about", "projects", "skills", "experience"].map((section) => (
                  getSectionConfig(section).isVisible && (
                    <a
                      key={section}
                      href={`#${section}`}
                      className="hover:text-primary transition-colors"
                    >
                      ./{section}
                    </a>
                  )
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              {socialLinks.slice(0, 3).map((link, index) => {
                const IconComponent = getSocialIcon(link.platform);
                return (
                  <Button key={index} variant="ghost" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <IconComponent className="w-4 h-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        {getSectionConfig("hero").isVisible && (
          <section className="py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Typography variant="small" className="text-primary font-mono">
                    // Welcome to my digital workspace
                  </Typography>
                  <Typography
                    variant="h1"
                    className="text-4xl md:text-5xl font-bold font-mono"
                    style={{ fontFamily: customization.typography.headingFont }}
                  >
                    {personalInfo.name}
                  </Typography>
                  <Typography variant="h2" className="text-primary font-mono">
                    {personalInfo.title}
                  </Typography>
                  <Typography variant="large" className="text-muted-foreground">
                    {personalInfo.bio}
                  </Typography>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="font-mono">
                    <Github className="w-4 h-4 mr-2" />
                    View GitHub
                  </Button>
                  <Button variant="outline" className="font-mono">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </Button>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground font-mono">
                  {personalInfo.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                  {personalInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <TerminalPrompt>whoami</TerminalPrompt>
                
                <Card className="p-6 bg-muted/50">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
                      <AvatarFallback className="font-mono">
                        {personalInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Typography variant="h3" className="font-mono">
                        {personalInfo.name}
                      </Typography>
                      <Typography variant="default" className="text-primary font-mono">
                        {personalInfo.title}
                      </Typography>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm font-mono">
                    <div>Status: <span className="text-green-500">Available for hire</span></div>
                    <div>Focus: <span className="text-blue-500">Full-stack development</span></div>
                    <div>Location: <span className="text-yellow-500">{personalInfo.location}</span></div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {getSectionConfig("projects").isVisible && projects.length > 0 && (
          <section id="projects" className="py-20">
            <div className="mb-12">
              <Typography variant="small" className="text-primary font-mono mb-2">
                // Featured repositories
              </Typography>
              <Typography
                variant="h1"
                className="text-3xl font-bold font-mono"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Projects
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-primary" />
                        <Typography variant="h3" className="font-mono">
                          {project.title.toLowerCase().replace(/\s+/g, "-")}
                        </Typography>
                      </div>
                      {project.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 space-y-4">
                    <Typography variant="default" className="text-muted-foreground">
                      {project.description}
                    </Typography>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="font-mono text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 100)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 20)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span>TypeScript</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {getSectionConfig("skills").isVisible && skills.length > 0 && (
          <section id="skills" className="py-20">
            <div className="mb-12">
              <Typography variant="small" className="text-primary font-mono mb-2">
                // Technical expertise
              </Typography>
              <Typography
                variant="h1"
                className="text-3xl font-bold font-mono"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Skills & Technologies
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(
                skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) {
                    acc[skill.category] = [];
                  }
                  acc[skill.category]!.push(skill);
                  return acc;
                }, {} as Record<string, typeof skills>)
              ).map(([category, categorySkills]) => {
                const IconComponent = getSkillIcon(category);
                return (
                  <Card key={category} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <Typography variant="h3" className="font-mono">
                        {category}
                      </Typography>
                    </div>
                    <div className="space-y-3">
                      {categorySkills.map((skill, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-mono">{skill.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div
                              className="bg-primary h-1 rounded-full transition-all duration-300"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {getSectionConfig("experience").isVisible && experience.length > 0 && (
          <section id="experience" className="py-20">
            <div className="mb-12">
              <Typography variant="small" className="text-primary font-mono mb-2">
                // Professional journey
              </Typography>
              <Typography
                variant="h1"
                className="text-3xl font-bold font-mono"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Experience
              </Typography>
            </div>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <Typography variant="h3" className="font-mono">
                          {exp.title}
                        </Typography>
                        <Badge variant="outline" className="font-mono text-xs w-fit">
                          {exp.duration}
                        </Badge>
                      </div>
                      <Typography variant="large" className="text-primary font-mono mb-3">
                        {exp.company}
                      </Typography>
                      <Typography variant="default" className="text-muted-foreground">
                        {exp.description}
                      </Typography>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {getSectionConfig("contact").isVisible && (
          <section id="contact" className="py-20">
            <div className="mb-12">
              <Typography variant="small" className="text-primary font-mono mb-2">
                // Get in touch
              </Typography>
              <Typography
                variant="h1"
                className="text-3xl font-bold font-mono"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Contact
              </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <TerminalPrompt>contact --info</TerminalPrompt>
                
                <Card className="p-6 bg-muted/50">
                  <div className="space-y-4 font-mono text-sm">
                    {personalInfo.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>Email: </span>
                        <a href={`mailto:${personalInfo.email}`} className="text-primary hover:underline">
                          {personalInfo.email}
                        </a>
                      </div>
                    )}
                    {personalInfo.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>Phone: </span>
                        <a href={`tel:${personalInfo.phone}`} className="text-primary hover:underline">
                          {personalInfo.phone}
                        </a>
                      </div>
                    )}
                    {personalInfo.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Location: </span>
                        <span>{personalInfo.location}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Typography variant="large" className="text-muted-foreground">
                  Ready to collaborate on your next project? Let's build something amazing together.
                </Typography>
                
                <div className="flex flex-col gap-4">
                  {personalInfo.email && (
                    <Button className="font-mono" asChild>
                      <a href={`mailto:${personalInfo.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </a>
                    </Button>
                  )}
                  
                  <div className="flex gap-3">
                    {socialLinks.map((link, index) => {
                      const IconComponent = getSocialIcon(link.platform);
                      return (
                        <Button key={index} variant="outline" size="sm" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <IconComponent className="w-4 h-4" />
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Typography variant="small" className="text-muted-foreground font-mono">
              © 2024 {personalInfo.name} • Built with ❤️ and ☕
            </Typography>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <GitBranch className="w-4 h-4" />
              <span>main</span>
              <span>•</span>
              <span>last updated: today</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};