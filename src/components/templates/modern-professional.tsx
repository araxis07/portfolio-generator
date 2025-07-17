"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Award,
  Code,
  Briefcase,
} from "lucide-react";

export const ModernProfessionalTemplate: React.FC<TemplateProps> = ({
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

  // Navigation items
  const navItems = [
    { id: "about", label: "About", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Building },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: Award },
    { id: "contact", label: "Contact", icon: Mail },
  ].filter((item) => getSectionConfig(item.id).isVisible);

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

  // Skill level bar
  const SkillBar = ({ skill }: { skill: { name: string; level: number; category: string } }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-xs text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${skill.level}%` }}
        />
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
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-80 bg-card border-r min-h-screen p-6 space-y-6",
            mode === "mobile" && "hidden",
            mode === "tablet" && "w-64"
          )}
        >
          {/* Profile Section */}
          <div className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
              <AvatarFallback className="text-lg">
                {personalInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <Typography
                variant="h2"
                className="mb-1"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                {personalInfo.name}
              </Typography>
              <Typography variant="large" className="text-primary font-medium">
                {personalInfo.title}
              </Typography>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <Typography variant="h4" className="font-semibold">
              Contact
            </Typography>
            {personalInfo.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="space-y-3">
              <Typography variant="h4" className="font-semibold">
                Social
              </Typography>
              <div className="space-y-2">
                {socialLinks.map((link, index) => {
                  const IconComponent = getSocialIcon(link.platform);
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-12">
          {/* Mobile Header */}
          {mode === "mobile" && (
            <div className="text-center space-y-4 pb-8 border-b">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
                <AvatarFallback>
                  {personalInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Typography variant="h1" className="mb-1">
                  {personalInfo.name}
                </Typography>
                <Typography variant="large" className="text-primary">
                  {personalInfo.title}
                </Typography>
              </div>
            </div>
          )}

          {/* About Section */}
          {getSectionConfig("about").isVisible && (
            <section id="about" className="space-y-6">
              <Typography
                variant="h1"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                About Me
              </Typography>
              <Typography variant="large" className="text-muted-foreground leading-relaxed">
                {personalInfo.bio}
              </Typography>
            </section>
          )}

          {/* Experience Section */}
          {getSectionConfig("experience").isVisible && experience.length > 0 && (
            <section id="experience" className="space-y-6">
              <Typography
                variant="h1"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Experience
              </Typography>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Typography variant="h3" className="mb-1">
                          {exp.title}
                        </Typography>
                        <Typography variant="large" className="text-primary font-medium">
                          {exp.company}
                        </Typography>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.duration}
                      </Badge>
                    </div>
                    <Typography variant="default" className="text-muted-foreground">
                      {exp.description}
                    </Typography>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Education Section */}
          {getSectionConfig("education").isVisible && education.length > 0 && (
            <section id="education" className="space-y-6">
              <Typography
                variant="h1"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Education
              </Typography>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="h3" className="mb-1">
                          {edu.degree}
                        </Typography>
                        <Typography variant="large" className="text-muted-foreground">
                          {edu.school}
                        </Typography>
                      </div>
                      <Badge variant="secondary">{edu.year}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {getSectionConfig("skills").isVisible && skills.length > 0 && (
            <section id="skills" className="space-y-6">
              <Typography
                variant="h1"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Skills
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <SkillBar skill={skill} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {getSectionConfig("projects").isVisible && projects.length > 0 && (
            <section id="projects" className="space-y-6">
              <Typography
                variant="h1"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Projects
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <Card key={index} className="overflow-hidden">
                    {project.image && (
                      <div className="aspect-video bg-muted">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Typography variant="h3">{project.title}</Typography>
                        {project.link && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Typography variant="default" className="text-muted-foreground mb-4">
                        {project.description}
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Contact Section */}
          {getSectionConfig("contact").isVisible && (
            <section id="contact" className="space-y-6">
              <Typography
                variant="h1"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Get In Touch
              </Typography>
              <Card className="p-8">
                <div className="text-center space-y-6">
                  <Typography variant="large" className="text-muted-foreground">
                    I'm always open to discussing new opportunities and interesting projects.
                  </Typography>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {personalInfo.email && (
                      <Button asChild>
                        <a href={`mailto:${personalInfo.email}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </a>
                      </Button>
                    )}
                    {socialLinks.find((link) => link.platform.toLowerCase() === "linkedin") && (
                      <Button variant="outline" asChild>
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
              </Card>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};