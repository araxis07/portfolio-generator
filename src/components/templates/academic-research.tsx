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
  BookOpen,
  Award,
  Users,
  FileText,
  Quote,
  Download,
  Presentation,
} from "lucide-react";

export const AcademicResearchTemplate: React.FC<TemplateProps> = ({
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

  // Mock research data (in a real implementation, this would come from the data)
  const publications = [
    {
      title: "Advanced Machine Learning Techniques in Natural Language Processing",
      authors: [personalInfo.name, "Dr. Jane Smith", "Prof. John Doe"],
      venue: "International Conference on Machine Learning (ICML)",
      year: "2024",
      type: "Conference Paper",
      citations: 15,
      link: "#",
    },
    {
      title: "A Comprehensive Study of Deep Learning Applications",
      authors: [personalInfo.name, "Dr. Alice Johnson"],
      venue: "Journal of Artificial Intelligence Research",
      year: "2023",
      type: "Journal Article",
      citations: 32,
      link: "#",
    },
  ];

  const researchInterests = [
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Deep Learning",
    "Artificial Intelligence",
  ];

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
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
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
                  className="text-2xl font-semibold mb-1"
                  style={{ fontFamily: customization.typography.headingFont }}
                >
                  {personalInfo.name}
                </Typography>
                <Typography variant="large" className="text-muted-foreground">
                  {personalInfo.title}
                </Typography>
                {personalInfo.location && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1" />

            {/* Navigation */}
            {mode !== "mobile" && (
              <nav className="flex items-center gap-6">
                {["about", "research", "publications", "experience", "contact"].map((section) => (
                  getSectionConfig(section).isVisible && (
                    <a
                      key={section}
                      href={`#${section}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                    >
                      {section}
                    </a>
                  )
                ))}
              </nav>
            )}

            {/* Contact Info */}
            <div className="flex items-center gap-4">
              {personalInfo.email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${personalInfo.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </a>
                </Button>
              )}
              <div className="flex gap-2">
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
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* About Section */}
        {getSectionConfig("about").isVisible && (
          <section id="about" className="mb-16">
            <div className="max-w-4xl">
              <Typography
                variant="h1"
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: customization.typography.headingFont }}
              >
                About
              </Typography>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <Typography variant="large" className="text-muted-foreground leading-relaxed">
                    {personalInfo.bio}
                  </Typography>
                  
                  <div className="space-y-2">
                    <Typography variant="h4" className="font-semibold">
                      Research Interests
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {researchInterests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="p-4">
                    <Typography variant="h4" className="font-semibold mb-3">
                      Quick Facts
                    </Typography>
                    <div className="space-y-2 text-sm">
                      {personalInfo.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <a href={`mailto:${personalInfo.email}`} className="hover:text-primary">
                            {personalInfo.email}
                          </a>
                        </div>
                      )}
                      {personalInfo.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{personalInfo.phone}</span>
                        </div>
                      )}
                      {personalInfo.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{personalInfo.location}</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card className="p-4">
                    <Typography variant="h4" className="font-semibold mb-3">
                      Academic Profile
                    </Typography>
                    <div className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Download CV
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Google Scholar
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        ORCID Profile
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Publications Section */}
        <section id="publications" className="mb-16">
          <Typography
            variant="h1"
            className="text-3xl font-bold mb-6"
            style={{ fontFamily: customization.typography.headingFont }}
          >
            Publications
          </Typography>

          <div className="space-y-6">
            {publications.map((pub, index) => (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Typography variant="h3" className="mb-2">
                        {pub.title}
                      </Typography>
                      <Typography variant="default" className="text-muted-foreground mb-2">
                        {pub.authors.join(", ")}
                      </Typography>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{pub.venue}</span>
                        <span>•</span>
                        <span>{pub.year}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {pub.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">{pub.citations}</div>
                        <div className="text-xs text-muted-foreground">Citations</div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={pub.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Research Projects Section */}
        {getSectionConfig("projects").isVisible && projects.length > 0 && (
          <section id="research" className="mb-16">
            <Typography
              variant="h1"
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: customization.typography.headingFont }}
            >
              Research Projects
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Presentation className="w-5 h-5 text-primary" />
                        <Typography variant="h3">{project.title}</Typography>
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

                    <div className="space-y-2">
                      <Typography variant="small" className="font-medium">
                        Technologies & Methods:
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {getSectionConfig("experience").isVisible && experience.length > 0 && (
          <section id="experience" className="mb-16">
            <Typography
              variant="h1"
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: customization.typography.headingFont }}
            >
              Academic Experience
            </Typography>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <Typography variant="h3">{exp.title}</Typography>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.duration}</span>
                        </div>
                      </div>
                      <Typography variant="large" className="text-primary font-medium mb-3">
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

        {/* Education Section */}
        {getSectionConfig("education").isVisible && education.length > 0 && (
          <section id="education" className="mb-16">
            <Typography
              variant="h1"
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: customization.typography.headingFont }}
            >
              Education
            </Typography>

            <div className="space-y-4">
              {education.map((edu, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {getSectionConfig("contact").isVisible && (
          <section id="contact" className="mb-16">
            <Typography
              variant="h1"
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: customization.typography.headingFont }}
            >
              Contact & Collaboration
            </Typography>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Typography variant="large" className="text-muted-foreground">
                  I'm always interested in discussing research collaborations, academic opportunities, 
                  and innovative projects in my areas of expertise.
                </Typography>

                <div className="space-y-4">
                  <Typography variant="h4" className="font-semibold">
                    Get in Touch
                  </Typography>
                  <div className="space-y-3">
                    {personalInfo.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Email</div>
                          <a href={`mailto:${personalInfo.email}`} className="text-muted-foreground hover:text-primary">
                            {personalInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {personalInfo.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <span className="text-muted-foreground">{personalInfo.phone}</span>
                        </div>
                      </div>
                    )}
                    {personalInfo.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Location</div>
                          <span className="text-muted-foreground">{personalInfo.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Card className="p-6">
                <Typography variant="h4" className="font-semibold mb-4">
                  Academic Networks
                </Typography>
                <div className="space-y-3">
                  {socialLinks.map((link, index) => {
                    const IconComponent = getSocialIcon(link.platform);
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <IconComponent className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium capitalize">{link.platform}</div>
                          <div className="text-sm text-muted-foreground">
                            Connect on {link.platform}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                      </a>
                    );
                  })}
                </div>
              </Card>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Typography variant="small" className="text-muted-foreground">
              © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
            </Typography>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};