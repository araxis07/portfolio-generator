"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Sparkles,
  Palette,
  Zap,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";

export const CreativePortfolioTemplate: React.FC<TemplateProps> = ({
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

  // Skill category colors
  const getSkillCategoryColor = (category: string) => {
    const colors = {
      Programming: "bg-blue-500",
      Frontend: "bg-green-500",
      Backend: "bg-purple-500",
      Cloud: "bg-orange-500",
      Design: "bg-pink-500",
      default: "bg-gray-500",
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-primary/5",
        mode === "mobile" && "max-w-sm mx-auto",
        mode === "tablet" && "max-w-2xl mx-auto",
        className
      )}
      style={{
        fontFamily: customization.typography.bodyFont,
      }}
    >
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <Typography variant="h4" className="font-bold">
                {personalInfo.name.split(" ")[0]}
              </Typography>
            </div>
            
            {mode !== "mobile" && (
              <div className="flex items-center gap-6">
                {["about", "projects", "skills", "contact"].map((section) => (
                  getSectionConfig(section).isVisible && (
                    <a
                      key={section}
                      href={`#${section}`}
                      className="text-sm font-medium hover:text-primary transition-colors capitalize"
                    >
                      {section}
                    </a>
                  )
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {socialLinks.slice(0, 3).map((link, index) => {
                const IconComponent = getSocialIcon(link.platform);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {getSectionConfig("hero").isVisible && (
        <section className="relative py-20 px-6 text-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-secondary/5 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 container mx-auto max-w-4xl space-y-8">
            <div className="space-y-6">
              <Avatar className="w-32 h-32 mx-auto ring-4 ring-primary/20">
                <AvatarImage src={personalInfo.avatar} alt={personalInfo.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-primary to-accent text-white">
                  {personalInfo.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-4">
                <Typography
                  variant="h1"
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
                  style={{ fontFamily: customization.typography.headingFont }}
                >
                  {personalInfo.name}
                </Typography>
                
                <div className="flex items-center justify-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <Typography variant="h2" className="text-primary font-semibold">
                    {personalInfo.title}
                  </Typography>
                </div>

                <Typography variant="large" className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {personalInfo.bio}
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Heart className="w-4 h-4 mr-2" />
                  View My Work
                </Button>
                <Button variant="outline" size="lg">
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-6 space-y-20">
        {/* About Section */}
        {getSectionConfig("about").isVisible && (
          <section id="about" className="py-20">
            <div className="text-center mb-16">
              <Typography
                variant="h1"
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                About Me
              </Typography>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Typography variant="large" className="text-muted-foreground leading-relaxed">
                  {personalInfo.bio}
                </Typography>
                
                {personalInfo.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {personalInfo.email && (
                    <Button variant="outline" asChild>
                      <a href={`mailto:${personalInfo.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Me
                      </a>
                    </Button>
                  )}
                  {personalInfo.phone && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${personalInfo.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Me
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {experience.slice(0, 2).map((exp, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="h4" className="mb-1">
                          {exp.title}
                        </Typography>
                        <Typography variant="default" className="text-primary font-medium mb-2">
                          {exp.company} • {exp.duration}
                        </Typography>
                        <Typography variant="small" className="text-muted-foreground">
                          {exp.description}
                        </Typography>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {getSectionConfig("projects").isVisible && projects.length > 0 && (
          <section id="projects" className="py-20">
            <div className="text-center mb-16">
              <Typography
                variant="h1"
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Featured Projects
              </Typography>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    {project.image ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Star className="w-12 h-12 text-primary" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {project.link && (
                      <Button
                        size="sm"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        asChild
                      >
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <Typography variant="h3" className="mb-2">
                      {project.title}
                    </Typography>
                    <Typography variant="default" className="text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
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
            <div className="text-center mb-16">
              <Typography
                variant="h1"
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Skills & Expertise
              </Typography>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="space-y-4">
                    <div className={cn("w-16 h-16 rounded-full mx-auto flex items-center justify-center", getSkillCategoryColor(skill.category))}>
                      <Typography variant="h3" className="text-white font-bold">
                        {skill.level}%
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h4" className="mb-1">
                        {skill.name}
                      </Typography>
                      <Typography variant="small" className="text-muted-foreground">
                        {skill.category}
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
            <div className="text-center mb-16">
              <Typography
                variant="h1"
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                Let's Create Together
              </Typography>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </div>

            <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="text-center space-y-6">
                <Typography variant="large" className="text-muted-foreground">
                  Ready to bring your creative vision to life? Let's discuss your next project!
                </Typography>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {personalInfo.email && (
                    <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90" asChild>
                      <a href={`mailto:${personalInfo.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Start a Conversation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  {socialLinks.map((link, index) => {
                    const IconComponent = getSocialIcon(link.platform);
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-80 transition-opacity flex items-center justify-center text-white"
                      >
                        <IconComponent className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <Typography variant="small" className="text-muted-foreground">
            © 2024 {personalInfo.name}. Crafted with creativity and passion.
          </Typography>
        </div>
      </footer>
    </div>
  );
};