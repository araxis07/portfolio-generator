# Development Workflow Guide

This document outlines the development workflow, tools, and best practices for the Portfolio Generator Web App Frontend.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Available Scripts](#available-scripts)
- [Code Quality Tools](#code-quality-tools)
- [Git Workflow](#git-workflow)
- [Environment Variables](#environment-variables)
- [VS Code Setup](#vs-code-setup)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Development Environment

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI + Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Drag & Drop**: DND Kit

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex components
│   ├── templates/      # Page layouts
│   └── ui/            # ShadCN UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── providers/          # Context providers
├── styles/             # Global styles
├── types/              # TypeScript type definitions
└── data/               # Static data and constants
```

## Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run dev:debug` - Start development server with Node.js inspector

### Building

- `npm run build` - Build for production
- `npm run build:analyze` - Build with bundle analyzer
- `npm run start` - Start production server
- `npm run start:prod` - Start production server with NODE_ENV=production

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run lint:strict` - Run ESLint with zero warnings allowed
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm run type-check:watch` - Run TypeScript type checking in watch mode

### Utilities

- `npm run clean` - Clean build artifacts
- `npm run clean:all` - Clean everything including node_modules
- `npm run reinstall` - Clean and reinstall dependencies
- `npm run analyze` - Analyze bundle size
- `npm run check` - Run all quality checks (type-check + lint + format)

### Pre-commit

- `npm run precommit` - Run lint-staged (automatically triggered by Husky)
- `npm run prebuild` - Run quality checks before build

## Code Quality Tools

### ESLint Configuration

- **Next.js**: Core web vitals and TypeScript rules
- **TypeScript**: Strict type checking and consistent imports
- **React**: Hooks rules and best practices
- **Accessibility**: jsx-a11y rules for WCAG compliance
- **Code Quality**: Unused variables, consistent formatting

### Prettier Configuration

- **Formatting**: Consistent code style across the project
- **Tailwind CSS**: Automatic class sorting with prettier-plugin-tailwindcss
- **Integration**: Works with ESLint for seamless formatting

### TypeScript Configuration

- **Strict Mode**: Enabled for better type safety
- **Path Aliases**: Configured for clean imports (@/components, @/lib, etc.)
- **Build Optimization**: Incremental compilation and strict checks

### Husky & Lint-Staged

- **Pre-commit Hooks**: Automatic linting and formatting before commits
- **Quality Gates**: Prevents commits with linting errors
- **Performance**: Only processes staged files

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `chore/description` - Maintenance tasks
- `docs/description` - Documentation updates

### Commit Messages

Follow conventional commits format:

- `feat: add new component`
- `fix: resolve styling issue`
- `docs: update README`
- `chore: update dependencies`

### Pre-commit Checks

Automatically runs on every commit:

1. ESLint with auto-fix
2. Prettier formatting
3. Type checking (on build)

## Environment Variables

### Development (.env.local)

```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Production

Required for production deployment:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Feature Flags

Control features via environment variables:

- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable/disable analytics
- `NEXT_PUBLIC_ENABLE_DARK_MODE` - Enable/disable dark mode
- `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` - Enable/disable notifications

## VS Code Setup

### Recommended Extensions

The project includes `.vscode/extensions.json` with recommended extensions:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero
- Auto Rename Tag
- Path Intellisense
- Error Lens
- Todo Tree

### Workspace Settings

Configured in `.vscode/settings.json`:

- Format on save with Prettier
- ESLint auto-fix on save
- Tailwind CSS class completion
- File nesting for better organization

## Troubleshooting

### Common Issues

1. **ESLint Errors**: Run `npm run lint:fix` to auto-fix issues
2. **Type Errors**: Run `npm run type-check` to see detailed errors
3. **Build Failures**: Run `npm run check` before building
4. **Dependency Issues**: Run `npm run reinstall` to clean install

### Performance

1. **Bundle Analysis**: Run `npm run analyze` to check bundle size
2. **Development Speed**: Use `npm run dev` with Turbopack for faster builds
3. **Type Checking**: Use `npm run type-check:watch` during development

### Environment Issues

1. **Missing Variables**: Check `.env.example` for required variables
2. **Production Errors**: Ensure all required production variables are set
3. **Feature Flags**: Use environment variables to control features

## Best Practices

### Code Organization

- Use atomic design principles for components
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper TypeScript types

### Performance

- Use Next.js Image component for optimized images
- Implement proper loading states
- Use React.memo for expensive components
- Optimize bundle size with dynamic imports

### Accessibility

- Follow WCAG guidelines
- Use semantic HTML elements
- Implement proper ARIA attributes
- Test with screen readers

### Testing

- Write unit tests for utilities
- Test components with user interactions
- Use TypeScript for better test reliability
- Mock external dependencies

## Deployment

### Build Process

1. Run quality checks: `npm run check`
2. Build application: `npm run build`
3. Test production build: `npm run start`
4. Deploy to hosting platform

### Environment Setup

1. Set production environment variables
2. Configure domain and SSL
3. Set up monitoring and analytics
4. Configure error tracking

---

For more information, refer to the individual configuration files and documentation in the project.
