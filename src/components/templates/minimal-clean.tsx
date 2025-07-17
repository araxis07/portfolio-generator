"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Calendar,
  Building,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

export const MinimalCleanTemplate: React.FC<TemplateProps> = ({
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
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Typography
                variant="h1"
                className="text-4xl md:text-6xl font-light tracking-tight"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                {personalInfo.name}
              </Typography>
              <Typography variant="h2" className="text-xl md:text-2xl text-muted-foreground font-light">
                {personalInfo.title}
              </Typography>
            </div>

            {/* Navigation */}
            {mode !== "mobile" && (
              <nav className="flex items-center justify-center gap-8 text-sm">
                {["about", "experience", "projects", "contact"].map((section) => (
                  getSectionConfig(section).isVisible && (
                    <a
                      key={section}
                      href={`#${section}`}
                      className="text-muted-foreground hover:text-foreground transition-colors capitalize tracking-wide"
                    >
                      {section}
                    </a>
                  )
                ))}
              </nav>
            )}

            <Separator className="max-w-24 mx-auto" />
          </div>
        </header>

        {/* About Section */}
        {getSectionConfig("about").isVisible && (
          <section id="about" className="mb-20">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <Typography
                variant="large"
                className="text-lg md:text-xl leading-relaxed text-muted-foreground font-light"
              >
                {personalInfo.bio}
              </Typography>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${personalInfo.email}`} className="hover:text-foreground transition-colors">
                      {personalInfo.email}
                    </a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${personalInfo.phone}`} className="hover:text-foreground transition-colors">
                      {personalInfo.phone}
                    </a>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="flex items-center justify-center gap-4">
                  {socialLinks.map((link, index) => {
                    const IconComponent = getSocialIcon(link.platform);
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {getSectionConfig("experience").isVisible && experience.length > 0 && (
          <section id="experience" className="mb-20">
            <div className="text-center mb-12">
              <Typography
                variant="h2"
                className="text-2xl md:text-3xl font-light tracking-tight mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Experience
              </Typography>
              <Separator className="max-w-16 mx-auto" />
            </div>

            <div className="space-y-12">
              {experience.map((exp, index) => (
                <div key={index} className="max-w-2xl mx-auto">
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <Typography variant="h3" className="text-xl font-medium">
                        {exp.title}
                      </Typography>
                      <div className="flex items-center justify-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{exp.company}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Typography variant="default" className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </Typography>
                  </div>
                  {index < experience.length - 1 && <Separator className="max-w-8 mx-auto mt-12" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {getSectionConfig("education").isVisible && education.length > 0 && (
          <section id="education" className="mb-20">
            <div className="text-center mb-12">
              <Typography
                variant="h2"
                className="text-2xl md:text-3xl font-light tracking-tight mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Education
              </Typography>
              <Separator className="max-w-16 mx-auto" />
            </div>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <div key={index} className="max-w-2xl mx-auto text-center">
                  <div className="space-y-2">
                    <Typography variant="h3" className="text-xl font-medium">
                      {edu.degree}
                    </Typography>
                    <div className="flex items-center justify-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{edu.school}</span>
                      </div>
                      <span>•</span>
                      <span>{edu.year}</span>
                    </div>
                  </div>
                  {index < education.length - 1 && <Separator className="max-w-8 mx-auto mt-8" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {getSectionConfig("skills").isVisible && skills.length > 0 && (
          <section id="skills" className="mb-20">
            <div className="text-center mb-12">
              <Typography
                variant="h2"
                className="text-2xl md:text-3xl font-light tracking-tight mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Skills
              </Typography>
              <Separator className="max-w-16 mx-auto" />
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(
                  skills.reduce((acc, skill) => {
                    if (!acc[skill.category]) {
                      acc[skill.category] = [];
                    }
                    acc[skill.category]!.push(skill);
                    return acc;
                  }, {} as Record<string, typeof skills>)
                ).map(([category, categorySkills]) => (
                  <div key={category} className="space-y-4">
                    <Typography variant="h4" className="font-medium text-center">
                      {category}
                    </Typography>
                    <div className="space-y-3">
                      {categorySkills.map((skill, index) => (
                        <div key={index} className="text-center">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1">
                            <div
                              className="bg-foreground h-1 rounded-full transition-all duration-300"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {getSectionConfig("projects").isVisible && projects.length > 0 && (
          <section id="projects" className="mb-20">
            <div className="text-center mb-12">
              <Typography
                variant="h2"
                className="text-2xl md:text-3xl font-light tracking-tight mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Selected Work
              </Typography>
              <Separator className="max-w-16 mx-auto" />
            </div>

            <div className="space-y-16">
              {projects.map((project, index) => (
                <div key={index} className="max-w-3xl mx-auto">
                  <div className="space-y-6">
                    {project.image && (
                      <div className="aspect-video bg-muted rounded overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Typography variant="h3" className="text-xl font-medium">
                          {project.title}
                        </Typography>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      
                      <Typography variant="default" className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </Typography>
                      
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {index < projects.length - 1 && <Separator className="max-w-8 mx-auto mt-16" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {getSectionConfig("contact").isVisible && (
          <section id="contact" className="mb-20">
            <div className="text-center mb-12">
              <Typography
                variant="h2"
                className="text-2xl md:text-3xl font-light tracking-tight mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Get In Touch
              </Typography>
              <Separator className="max-w-16 mx-auto" />
            </div>

            <div className="max-w-2xl mx-auto text-center space-y-8">
              <Typography variant="large" className="text-muted-foreground leading-relaxed">
                I'm always interested in hearing about new opportunities and projects. 
                Whether you have a question or just want to say hello, feel free to reach out.
              </Typography>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {personalInfo.email && (
                  <Button variant="outline" className="font-light" asChild>
                    <a href={`mailto:${personalInfo.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                )}
                
                {socialLinks.find((link) => link.platform.toLowerCase() === "linkedin") && (
                  <Button variant="outline" className="font-light" asChild>
                    <a
                      href={socialLinks.find((link) => link.platform.toLowerCase() === "linkedin")?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-16 border-t">
          <Typography variant="small" className="text-muted-foreground font-light">
            © {new Date().getFullYear()} {personalInfo.name}
          </Typography>
        </footer>
      </div>
    </div>
  );
};