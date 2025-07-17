// Design System Configuration
// Centralized design tokens and theme configuration for the Portfolio Generator


// =============================================================================
// DESIGN TOKENS
// =============================================================================

export const designTokens = {
  // Spacing Scale (Tailwind-based)
  spacing: {
    none: "0",
    xs: "0.125rem", // 2px
    sm: "0.25rem",  // 4px
    md: "0.5rem",   // 8px
    lg: "1rem",     // 16px
    xl: "1.5rem",   // 24px
    "2xl": "2rem",  // 32px
    "3xl": "3rem",  // 48px
    "4xl": "4rem",  // 64px
    "5xl": "6rem",  // 96px
  },

  // Typography Scale
  typography: {
    fontSizes: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem",    // 48px
      "6xl": "3.75rem", // 60px
    },
    fontWeights: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
    lineHeights: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },
    letterSpacing: {
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // Border Radius Scale
  borderRadius: {
    none: "0",
    sm: "0.125rem",   // 2px
    md: "0.375rem",   // 6px
    lg: "0.5rem",     // 8px
    xl: "0.75rem",    // 12px
    "2xl": "1rem",    // 16px
    "3xl": "1.5rem",  // 24px
    full: "9999px",
  },

  // Shadow Scale
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },

  // Animation Durations
  animations: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  // Z-Index Scale
  zIndex: {
    hide: "-1",
    auto: "auto",
    base: "0",
    docked: "10",
    dropdown: "1000",
    sticky: "1100",
    banner: "1200",
    overlay: "1300",
    modal: "1400",
    popover: "1500",
    skipLink: "1600",
    toast: "1700",
    tooltip: "1800",
  },
} as const;

// =============================================================================
// COMPONENT SIZE VARIANTS
// =============================================================================

export const sizeVariants = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;

export type SizeVariant = keyof typeof sizeVariants;

// =============================================================================
// COLOR SEMANTIC MAPPING
// =============================================================================

export const semanticColors = {
  // Status Colors
  success: {
    light: "hsl(142 76% 36%)",
    dark: "hsl(142 71% 45%)",
  },
  warning: {
    light: "hsl(38 92% 50%)",
    dark: "hsl(48 96% 53%)",
  },
  error: {
    light: "hsl(0 84% 60%)",
    dark: "hsl(0 91% 71%)",
  },
  info: {
    light: "hsl(221 83% 53%)",
    dark: "hsl(217 91% 60%)",
  },

  // Neutral Colors
  neutral: {
    50: "hsl(210 40% 98%)",
    100: "hsl(210 40% 96%)",
    200: "hsl(214 32% 91%)",
    300: "hsl(213 27% 84%)",
    400: "hsl(215 20% 65%)",
    500: "hsl(215 16% 47%)",
    600: "hsl(215 19% 35%)",
    700: "hsl(215 25% 27%)",
    800: "hsl(217 33% 17%)",
    900: "hsl(222 84% 5%)",
  },
} as const;

// =============================================================================
// COMPONENT VARIANTS
// =============================================================================

export const componentVariants = {
  // Button variants
  button: {
    variant: {
      default: "default",
      destructive: "destructive",
      outline: "outline",
      secondary: "secondary",
      ghost: "ghost",
      link: "link",
    },
    size: {
      sm: "sm",
      md: "md",
      lg: "lg",
      icon: "icon",
    },
  },

  // Card variants
  card: {
    variant: {
      default: "default",
      outlined: "outlined",
      elevated: "elevated",
      ghost: "ghost",
      filled: "filled",
    },
    size: {
      sm: "sm",
      md: "md",
      lg: "lg",
      xl: "xl",
    },
  },

  // Typography variants
  typography: {
    variant: {
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      h5: "h5",
      h6: "h6",
      p: "p",
      blockquote: "blockquote",
      code: "code",
      lead: "lead",
      large: "large",
      small: "small",
      muted: "muted",
    },
  },
} as const;

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// =============================================================================
// ACCESSIBILITY CONSTANTS
// =============================================================================

export const a11y = {
  // Focus ring styles
  focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  
  // Screen reader only styles
  srOnly: "sr-only",
  
  // Skip link styles
  skipLink: "absolute left-[-10000px] top-auto w-1 h-1 overflow-hidden focus:left-6 focus:top-7 focus:w-auto focus:h-auto focus:overflow-visible",
  
  // Minimum touch target size (44px)
  minTouchTarget: "min-h-[44px] min-w-[44px]",
  
  // High contrast mode support
  highContrast: "forced-colors:border-[ButtonBorder] forced-colors:text-[ButtonText]",
} as const;

// =============================================================================
// ANIMATION PRESETS
// =============================================================================

export const animations = {
  // Fade animations
  fadeIn: "animate-in fade-in-0",
  fadeOut: "animate-out fade-out-0",
  
  // Slide animations
  slideInFromTop: "animate-in slide-in-from-top-2",
  slideInFromBottom: "animate-in slide-in-from-bottom-2",
  slideInFromLeft: "animate-in slide-in-from-left-2",
  slideInFromRight: "animate-in slide-in-from-right-2",
  
  // Scale animations
  scaleIn: "animate-in zoom-in-95",
  scaleOut: "animate-out zoom-out-95",
  
  // Combined animations
  dialogIn: "animate-in fade-in-0 zoom-in-95 duration-200",
  dialogOut: "animate-out fade-out-0 zoom-out-95 duration-200",
  
  sheetInFromRight: "animate-in slide-in-from-right-full duration-300",
  sheetOutToRight: "animate-out slide-out-to-right-full duration-300",
  
  popoverIn: "animate-in fade-in-0 zoom-in-95 duration-200",
  popoverOut: "animate-out fade-out-0 zoom-out-95 duration-200",
  
  tooltipIn: "animate-in fade-in-0 zoom-in-95 duration-150",
  tooltipOut: "animate-out fade-out-0 zoom-out-95 duration-150",
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get design token value by path
 */
export function getToken(path: string): string {
  const keys = path.split(".");
  let value: any = designTokens;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || "";
}

/**
 * Create responsive classes
 */
export function responsive(classes: Record<string, string>): string {
  return Object.entries(classes)
    .map(([breakpoint, className]) => 
      breakpoint === "base" ? className : `${breakpoint}:${className}`
    )
    .join(" ");
}

/**
 * Create hover and focus states
 */
export function interactive(baseClass: string, hoverClass?: string, focusClass?: string): string {
  const classes = [baseClass];
  
  if (hoverClass) {
    classes.push(`hover:${hoverClass}`);
  }
  
  if (focusClass) {
    classes.push(`focus:${focusClass}`);
  } else {
    classes.push(a11y.focusRing);
  }
  
  return classes.join(" ");
}

/**
 * Create dark mode variant
 */
export function darkMode(lightClass: string, darkClass: string): string {
  return `${lightClass} dark:${darkClass}`;
}

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

export const themeConfig = {
  // Default theme values
  default: {
    primary: "hsl(222.2 84% 4.9%)",
    secondary: "hsl(210 40% 96%)",
    accent: "hsl(210 40% 96%)",
    background: "hsl(0 0% 100%)",
    foreground: "hsl(222.2 84% 4.9%)",
    muted: "hsl(210 40% 96%)",
    border: "hsl(214.3 31.8% 91.4%)",
    ring: "hsl(222.2 84% 4.9%)",
  },
  
  // Dark theme values
  dark: {
    primary: "hsl(210 40% 98%)",
    secondary: "hsl(217.2 32.6% 17.5%)",
    accent: "hsl(217.2 32.6% 17.5%)",
    background: "hsl(222.2 84% 4.9%)",
    foreground: "hsl(210 40% 98%)",
    muted: "hsl(217.2 32.6% 17.5%)",
    border: "hsl(217.2 32.6% 17.5%)",
    ring: "hsl(212.7 26.8% 83.9%)",
  },
} as const;

export type ThemeConfig = typeof themeConfig;
export type DesignTokens = typeof designTokens;
export type ComponentVariants = typeof componentVariants;