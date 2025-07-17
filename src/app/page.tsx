"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Palette,
  Smartphone,
  Star,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Component imports
import {
  Button,
  Typography,
  Container,
  Grid,
  FeatureCard,
  BasicCard,
  Header,
  Footer,
  Badge,
  Logo,
} from "@/components";

export default function LandingPage() {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);

  // Feature data
  const features = [
    {
      icon: Zap,
      title: "Easy to Use",
      description: "Simple multi-step process to create your portfolio in minutes",
      color: "text-yellow-500",
    },
    {
      icon: Palette,
      title: "Professional Templates",
      description: "Beautiful, responsive designs crafted by professionals",
      color: "text-purple-500",
    },
    {
      icon: Download,
      title: "Instant Export",
      description: "Download your ready-to-use portfolio instantly",
      color: "text-green-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Your portfolio looks perfect on all devices",
      color: "text-blue-500",
    },
    {
      icon: FileText,
      title: "No Coding Required",
      description: "User-friendly interface, no technical skills needed",
      color: "text-orange-500",
    },
    {
      icon: Star,
      title: "Free to Use",
      description: "Create unlimited portfolios with no hidden costs",
      color: "text-pink-500",
    },
  ];

  // Template preview data
  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      image: {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
        width: 400,
        height: 300,
      },
      description: "Clean, modern design perfect for developers and designers",
      tags: ["Modern", "Clean", "Professional"],
    },
    {
      id: 2,
      name: "Creative Portfolio",
      image: {
        src: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center",
        width: 400,
        height: 300,
      },
      description: "Vibrant and creative layout for artists and creatives",
      tags: ["Creative", "Colorful", "Artistic"],
    },
    {
      id: 3,
      name: "Minimalist",
      image: {
        src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop&crop=center",
        width: 400,
        height: 300,
      },
      description: "Simple, elegant design that focuses on content",
      tags: ["Minimal", "Clean", "Simple"],
    },
    {
      id: 4,
      name: "Business Executive",
      image: {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
        width: 400,
        height: 300,
      },
      description: "Professional layout for business professionals",
      tags: ["Business", "Corporate", "Professional"],
    },
  ];

  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Enter Your Information",
      description: "Fill in your personal and professional details using our intuitive form",
      icon: FileText,
    },
    {
      number: "02",
      title: "Choose a Template",
      description: "Select from our collection of beautiful, responsive designs",
      icon: Palette,
    },
    {
      number: "03",
      title: "Preview & Customize",
      description: "See your portfolio come to life and make final adjustments",
      icon: Eye,
    },
    {
      number: "04",
      title: "Export & Share",
      description: "Download your portfolio and share it with the world",
      icon: Download,
    },
  ];

  const nextTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev + 1) % templates.length);
  };

  const prevTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev - 1 + templates.length) % templates.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        logo={<Logo text="Portfolio Generator" href="/" />}
        navigation={[
          { label: "Home", href: "/" },
          { label: "Templates", href: "/theme" },
          { label: "Examples", href: "/examples" },
          { label: "About", href: "/about" },
        ]}
        showThemeToggle
        className="border-b"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 lg:py-32">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              ✨ Create Professional Portfolios
            </Badge>
            
            <Typography
              variant="h1"
              className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent text-4xl font-bold leading-tight lg:text-6xl"
            >
              Create Your Professional Portfolio in Minutes!
            </Typography>
            
            <Typography
              variant="p"
              className="mb-8 text-xl text-muted-foreground lg:text-2xl"
            >
              Transform your career with stunning, responsive portfolios. No coding required, 
              just your creativity and our powerful tools.
            </Typography>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/profile">
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg" asChild>
                <Link href="/theme">
                  View Templates
                  <Eye className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant Download</span>
              </div>
            </div>
          </div>
        </Container>

        {/* Hero Background Elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20">
        <Container>
          <div className="mb-16 text-center">
            <Typography variant="h2" className="mb-4 text-3xl font-bold lg:text-4xl">
              Why Choose Our Portfolio Generator?
            </Typography>
            <Typography variant="p" className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to create a stunning portfolio that stands out from the crowd
            </Typography>
          </div>

          <Grid cols={1} className="gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="group transition-all duration-300 hover:scale-105 hover:shadow-lg"
              />
            ))}
          </Grid>
        </Container>
      </section>

      {/* Template Preview Section */}
      <section className="bg-muted/30 py-20">
        <Container>
          <div className="mb-16 text-center">
            <Typography variant="h2" className="mb-4 text-3xl font-bold lg:text-4xl">
              Beautiful Templates
            </Typography>
            <Typography variant="p" className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Choose from our collection of professionally designed templates
            </Typography>
          </div>

          {/* Template Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${currentTemplateIndex * 100}%)` }}>
                {templates.map((template) => (
                  <div key={template.id} className="w-full flex-shrink-0">
                    <BasicCard
                      title={template.name}
                      description={template.description}
                      image={{
                        src: template.image.src,
                        alt: template.name,
                        aspectRatio: "video",
                      }}
                      className="mx-auto max-w-2xl"
                      actions={[
                        {
                          label: "Preview",
                          onClick: () => console.log(`Preview ${template.name}`),
                        },
                        {
                          label: "Use Template",
                          onClick: () => console.log(`Use ${template.name}`),
                        },
                      ]}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={prevTemplate}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={nextTemplate}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="mt-8 flex justify-center gap-2">
              {templates.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentTemplateIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  onClick={() => setCurrentTemplateIndex(index)}
                  aria-label={`Go to template ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/theme">
                View All Templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <Container>
          <div className="mb-16 text-center">
            <Typography variant="h2" className="mb-4 text-3xl font-bold lg:text-4xl">
              How It Works
            </Typography>
            <Typography variant="p" className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Create your professional portfolio in just four simple steps
            </Typography>
          </div>

          <div className="relative">
            <Grid cols={1} className="gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-8 w-8" />
                  </div>
                  
                  <div className="mb-2 text-sm font-medium text-primary">
                    STEP {step.number}
                  </div>
                  
                  <Typography variant="h3" className="mb-3 text-xl font-semibold">
                    {step.title}
                  </Typography>
                  
                  <Typography variant="p" className="text-muted-foreground">
                    {step.description}
                  </Typography>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-full top-8 hidden h-0.5 w-full bg-border lg:block" />
                  )}
                </div>
              ))}
            </Grid>
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" asChild>
              <Link href="/profile">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <Container>
          <Grid cols={1} className="gap-8 text-center md:grid-cols-3">
            <div>
              <Typography variant="h3" className="mb-2 text-4xl font-bold">
                10,000+
              </Typography>
              <Typography variant="p" className="text-primary-foreground/80">
                Portfolios Created
              </Typography>
            </div>
            
            <div>
              <Typography variant="h3" className="mb-2 text-4xl font-bold">
                50+
              </Typography>
              <Typography variant="p" className="text-primary-foreground/80">
                Professional Templates
              </Typography>
            </div>
            
            <div>
              <Typography variant="h3" className="mb-2 text-4xl font-bold">
                99%
              </Typography>
              <Typography variant="p" className="text-primary-foreground/80">
                User Satisfaction
              </Typography>
            </div>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Typography variant="h2" className="mb-6 text-3xl font-bold lg:text-4xl">
              Ready to Create Your Portfolio?
            </Typography>
            
            <Typography variant="p" className="mb-8 text-lg text-muted-foreground">
              Join thousands of professionals who have already created stunning portfolios 
              with our easy-to-use generator.
            </Typography>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/profile">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="text-lg" asChild>
                <Link href="/examples">
                  See Examples
                  <Eye className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <Footer
        layout="columns"
        logo={<Logo text="Portfolio Generator" />}
        description="Create stunning, professional portfolios with ease. No coding required."
        sections={[
          {
            title: "Product",
            links: [
              { label: "Templates", href: "/theme" },
              { label: "Examples", href: "/examples" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "/pricing" },
            ],
          },
          {
            title: "Resources",
            links: [
              { label: "Documentation", href: "/docs" },
              { label: "Help Center", href: "/help" },
              { label: "Blog", href: "/blog" },
              { label: "Tutorials", href: "/tutorials" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ],
          },
        ]}
        socialLinks={[
          { platform: "github", url: "https://github.com/portfolio-generator" },
          { platform: "twitter", url: "https://twitter.com/portfoliogen" },
          { platform: "linkedin", url: "https://linkedin.com/company/portfolio-generator" },
        ]}
        copyright="© 2024 Portfolio Generator. All rights reserved."
      />
    </div>
  );
}
