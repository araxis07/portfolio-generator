# Portfolio Generator UI Component Library

A comprehensive, accessible, and themeable component library built with React, TypeScript, Tailwind CSS, and following atomic design principles.

## 🏗️ Architecture

This component library follows **Atomic Design** methodology:

- **Atoms**: Basic building blocks (Logo, Icon, Typography, etc.)
- **Molecules**: Simple combinations of atoms (Navigation, Form fields, etc.)
- **Organisms**: Complex UI components (Header, Footer, Modals, etc.)
- **Templates/Layouts**: Page-level components (PageWrapper, Grid layouts, etc.)

## 🎨 Design System

### Core Principles

- **Accessibility First**: WCAG 2.1 AA compliant
- **Theme Support**: Light/Dark mode with custom themes
- **Responsive**: Mobile-first responsive design
- **Type Safe**: Full TypeScript support
- **Consistent**: Unified design tokens and spacing

### Design Tokens

```typescript
import { designTokens } from '@/lib/design-system';

// Spacing scale
designTokens.spacing.lg // 1rem (16px)

// Typography scale
designTokens.typography.fontSizes.xl // 1.25rem (20px)

// Border radius
designTokens.borderRadius.md // 0.375rem (6px)
```

## 📦 Installation & Usage

### Basic Import

```typescript
import { Button, Card, Typography } from '@/components';
```

### Category-specific Imports

```typescript
// Atoms
import { Logo, Icon, Typography } from '@/components/atoms';

// Molecules
import { Navigation, Search, Tags } from '@/components/molecules';

// Organisms
import { Header, Footer, FormWizard } from '@/components/organisms';

// Layouts
import { PageWrapper, Grid, Container } from '@/components/layouts';
```

## 🧩 Component Categories

### Enhanced ShadCN UI Components

Base UI primitives enhanced with additional features:

- `Badge` - Status indicators and labels
- `Avatar` - User profile images with fallbacks
- `Button` - Interactive buttons with variants
- `Dialog` - Modal dialogs and overlays
- `Sheet` - Slide-out panels
- `Form` - Form components with validation
- `Progress` - Progress indicators
- `Skeleton` - Loading placeholders
- `Tooltip` - Contextual help text

### Atoms (Basic Building Blocks)

#### Logo
```typescript
<Logo 
  text="Portfolio" 
  variant="gradient" 
  size="lg" 
  href="/" 
/>
```

#### Typography
```typescript
<Typography variant="h1" className="mb-4">
  Main Heading
</Typography>

<Typography variant="p" className="text-muted-foreground">
  Body text content
</Typography>
```

#### Icon
```typescript
<Icon 
  icon={ChevronRight} 
  size="md" 
  className="text-primary" 
/>
```

#### Loading
```typescript
<Loading 
  size="lg" 
  variant="spinner" 
  className="mx-auto" 
/>
```

### Molecules (Simple Combinations)

#### Navigation
```typescript
<Navigation
  items={[
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { 
      label: "Services", 
      href: "/services",
      children: [
        { label: "Web Design", href: "/services/web" },
        { label: "Development", href: "/services/dev" }
      ]
    }
  ]}
  variant="horizontal"
  showMobileMenu
/>
```

#### Form Fields
```typescript
<TextField
  label="Email"
  type="email"
  placeholder="Enter your email"
  required
  error="Please enter a valid email"
/>

<SelectField
  label="Country"
  options={[
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" }
  ]}
  placeholder="Select country"
/>
```

#### Search
```typescript
<Search
  placeholder="Search projects..."
  suggestions={["React", "TypeScript", "Next.js"]}
  onSearch={(query) => console.log(query)}
  showFilters
/>
```

### Organisms (Complex Components)

#### Header
```typescript
<Header
  logo={{ text: "Portfolio", href: "/" }}
  navigation={navigationItems}
  showSearch
  showThemeToggle
  showSocialLinks
  socialLinks={[
    { platform: "github", url: "https://github.com/username" },
    { platform: "linkedin", url: "https://linkedin.com/in/username" }
  ]}
/>
```

#### Footer
```typescript
<Footer
  variant="columns"
  logo={{ text: "Portfolio" }}
  description="Building amazing web experiences"
  sections={[
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" }
      ]
    }
  ]}
  socialLinks={socialLinks}
  copyright="© 2024 Portfolio. All rights reserved."
/>
```

#### Form Wizard
```typescript
<FormWizard
  steps={[
    {
      id: "personal",
      title: "Personal Info",
      content: <PersonalInfoForm />,
      validation: () => validatePersonalInfo()
    },
    {
      id: "preferences",
      title: "Preferences",
      content: <PreferencesForm />
    }
  ]}
  onComplete={() => console.log("Wizard completed")}
  showProgress
/>
```

#### Modals
```typescript
// Confirmation Modal
<ConfirmationModal
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Delete Project"
  description="Are you sure you want to delete this project?"
  variant="destructive"
  onConfirm={handleDelete}
/>

// Alert Modal
<AlertModal
  open={showAlert}
  onOpenChange={setShowAlert}
  variant="success"
  title="Success!"
  description="Your project has been saved successfully."
/>
```

### Layouts (Page Structure)

#### PageWrapper
```typescript
<PageWrapper
  title="Dashboard"
  description="Manage your portfolio projects"
  breadcrumbs={[
    { label: "Home", href: "/" },
    { label: "Dashboard", current: true }
  ]}
  actions={[
    {
      label: "New Project",
      onClick: () => setShowModal(true),
      icon: Plus
    }
  ]}
>
  <YourPageContent />
</PageWrapper>
```

#### Grid Layouts
```typescript
// Responsive Grid
<Grid cols={3} gap="lg">
  <GridItem span={2}>
    <Card>Main content</Card>
  </GridItem>
  <GridItem span={1}>
    <Card>Sidebar</Card>
  </GridItem>
</Grid>

// Flex Layout
<Flex direction="col" gap="md" align="center">
  <Typography variant="h2">Centered Content</Typography>
  <Button>Action Button</Button>
</Flex>
```

#### Card Layouts
```typescript
// Basic Card
<BasicCard
  title="Project Title"
  description="Project description here"
  image={{
    src: "/project-image.jpg",
    alt: "Project screenshot"
  }}
  actions={[
    { label: "View", onClick: () => {} },
    { label: "Edit", onClick: () => {} }
  ]}
/>

// Feature Card
<FeatureCard
  icon={Zap}
  title="Fast Performance"
  description="Optimized for speed and efficiency"
  link={{ href: "/features", label: "Learn more" }}
/>
```

## 🎨 Theming

### Theme Provider Setup

```typescript
import { ThemeProvider } from '@/providers/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Using Theme Components

```typescript
import { ThemeSelector, ThemeModeSelector } from '@/components/organisms';

// Theme mode selector (light/dark/system)
<ThemeModeSelector
  mode={theme}
  onModeChange={setTheme}
/>

// Color theme selector
<ThemeCards
  themes={defaultThemes}
  selectedTheme={selectedTheme}
  onThemeSelect={setSelectedTheme}
/>
```

## ♿ Accessibility Features

### Built-in Accessibility

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations
- **Responsive Text**: Scalable typography that respects user preferences

### Accessibility Utilities

```typescript
import { a11y } from '@/lib/design-system';

// Focus ring styles
className={a11y.focusRing}

// Screen reader only content
<span className={a11y.srOnly}>Hidden from visual users</span>

// Minimum touch target
className={a11y.minTouchTarget}
```

## 🎯 Best Practices

### Component Usage

1. **Use semantic HTML**: Components render appropriate HTML elements
2. **Provide alt text**: Always include alt text for images
3. **Label form fields**: Use proper labels for all form inputs
4. **Handle loading states**: Show loading indicators for async operations
5. **Error handling**: Display clear error messages

### Performance

1. **Lazy loading**: Components support lazy loading where appropriate
2. **Tree shaking**: Import only what you need
3. **Optimized images**: Use the Image component for optimized loading
4. **Minimal re-renders**: Components are optimized to prevent unnecessary renders

### Styling

1. **Use design tokens**: Leverage the design system for consistency
2. **Responsive design**: Test components across different screen sizes
3. **Dark mode**: Ensure components work in both light and dark themes
4. **Custom variants**: Extend components with custom variants when needed

## 🔧 Customization

### Extending Components

```typescript
import { Button, buttonVariants } from '@/components';
import { cva } from 'class-variance-authority';

// Create custom variant
const customButtonVariants = cva(
  buttonVariants.base,
  {
    variants: {
      ...buttonVariants.variants,
      variant: {
        ...buttonVariants.variants.variant,
        custom: "bg-purple-500 hover:bg-purple-600 text-white"
      }
    }
  }
);

// Use custom variant
<Button variant="custom">Custom Button</Button>
```

### Custom Themes

```typescript
// Define custom theme colors
const customTheme = {
  primary: "hsl(280 100% 70%)",
  secondary: "hsl(280 30% 90%)",
  // ... other colors
};

// Apply via CSS variables or Tailwind config
```

## 📱 Responsive Design

All components are built mobile-first and include responsive variants:

```typescript
// Responsive grid
<Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</Grid>

// Responsive typography
<Typography 
  variant="h1" 
  className="text-2xl md:text-4xl lg:text-6xl"
>
  Responsive Heading
</Typography>
```

## 🧪 Testing

Components are designed to be easily testable:

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

## 📚 Examples

Check the `/examples` directory for complete implementation examples:

- Basic portfolio page
- Dashboard layout
- Form wizard implementation
- Theme customization
- Accessibility demonstrations

## 🤝 Contributing

1. Follow the atomic design principles
2. Ensure accessibility compliance
3. Add proper TypeScript types
4. Include comprehensive tests
5. Update documentation

## 📄 License

This component library is part of the Portfolio Generator project and follows the same license terms.