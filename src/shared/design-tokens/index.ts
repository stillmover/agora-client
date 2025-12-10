export const spacing = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  2: "8px",
  2.5: "10px",
  20: "80px",
  24: "96px",
  28: "112px",
  3: "12px",
  3.5: "14px",
  32: "128px",
  36: "144px",
  4: "16px",
  40: "160px",
  44: "176px",
  48: "192px",
  5: "20px",
  52: "208px",
  56: "224px",
  6: "24px",
  60: "240px",
  64: "256px",
  7: "28px",
  72: "288px",
  8: "32px",
  80: "320px",
  9: "36px",
  96: "384px",
} as const;

export const typography = {
  fontFamily: {
    mono: '"JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace',
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSize: {
    "2xl": ["1.5rem", { letterSpacing: "-0.02em", lineHeight: "2rem" }],
    "3xl": ["1.875rem", { letterSpacing: "-0.025em", lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { letterSpacing: "-0.03em", lineHeight: "2.5rem" }],
    "5xl": ["3rem", { letterSpacing: "-0.035em", lineHeight: "1" }],
    base: ["1rem", { letterSpacing: "0", lineHeight: "1.5rem" }],
    lg: ["1.125rem", { letterSpacing: "-0.01em", lineHeight: "1.75rem" }],
    sm: ["0.875rem", { letterSpacing: "0.01em", lineHeight: "1.25rem" }],
    xl: ["1.25rem", { letterSpacing: "-0.015em", lineHeight: "1.75rem" }],
    xs: ["0.75rem", { letterSpacing: "0.025em", lineHeight: "1rem" }],
  },
  fontWeight: {
    bold: "700",
    extrabold: "800",
    medium: "500",
    normal: "400",
    semibold: "600",
  },
} as const;

export const colors = {
  error: {
    DEFAULT: "#EF4444",
    dark: "#B91C1C",
    light: "#FEF2F2",
  },
  gray: {
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    50: "#FAFAFA",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    950: "#121212",
  },
  info: {
    DEFAULT: "#3B82F6",
    dark: "#1D4ED8",
    light: "#EFF6FF",
  },
  orange: {
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    50: "#FFF7ED",
    500: "#FF4500",
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
  },
  success: {
    DEFAULT: "#10B981",
    dark: "#047857",
    light: "#ECFDF5",
  },
  vote: {
    down: "#7193FF",
    downHover: "#5A7DE8",
    up: "#FF4500",
    upHover: "#E03D00",
  },
  warning: {
    DEFAULT: "#F59E0B",
    dark: "#B45309",
    light: "#FFFBEB",
  },
} as const;

export const radius = {
  "2xl": "20px",
  "3xl": "24px",
  DEFAULT: "8px",
  full: "9999px",
  lg: "12px",
  md: "10px",
  none: "0",
  sm: "4px",
  xl: "16px",
} as const;

export const shadows = {
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  DEFAULT: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  glow: "0 0 20px 5px rgba(255, 69, 0, 0.15)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
} as const;

export const transitions = {
  duration: {
    fast: "100ms",
    normal: "150ms",
    slow: "200ms",
    slower: "300ms",
    slowest: "500ms",
  },
  easing: {
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    linear: "linear",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

export const zIndex = {
  auto: "auto",
  banner: 1200,
  base: 0,
  docked: 10,
  dropdown: 1000,
  hide: -1,
  modal: 1400,
  overlay: 1300,
  popover: 1500,
  skipLink: 1600,
  sticky: 1100,
  toast: 1700,
  tooltip: 1800,
} as const;

export const breakpoints = {
  "2xl": "1536px",
  lg: "1024px",
  md: "768px",
  sm: "640px",
  xl: "1280px",
  xs: "320px",
} as const;

export const layout = {
  header: {
    height: "64px",
  },
  maxWidth: {
    content: "1280px",
    narrow: "768px",
    wide: "1536px",
  },
  sidebar: {
    collapsedWidth: "72px",
    width: "280px",
  },
} as const;

export const components = {
  avatar: {
    radius: radius.full,
    size: {
      "2xl": "80px",
      lg: "48px",
      md: "40px",
      sm: "32px",
      xl: "64px",
      xs: "24px",
    },
  },
  badge: {
    fontSize: typography.fontSize.xs[0],
    height: {
      lg: "28px",
      md: "24px",
      sm: "20px",
    },
    paddingX: {
      lg: spacing[2.5],
      md: spacing[2],
      sm: spacing[1.5],
    },
    radius: radius.full,
  },
  button: {
    fontSize: {
      lg: typography.fontSize.base[0],
      md: typography.fontSize.sm[0],
      sm: typography.fontSize.xs[0],
    },
    height: {
      lg: "48px",
      md: "40px",
      sm: "32px",
    },
    paddingX: {
      lg: spacing[6],
      md: spacing[4],
      sm: spacing[3],
    },
    radius: radius.md,
  },
  card: {
    border: "1px solid",
    borderColor: colors.gray[200],
    darkBorderColor: "rgba(255, 255, 255, 0.1)",
    hoverShadow: shadows.md,
    padding: spacing[4],
    paddingLg: spacing[6],
    radius: radius.lg,
    shadow: shadows.sm,
  },
  input: {
    borderWidth: "1px",
    height: {
      lg: "48px",
      md: "40px",
      sm: "32px",
    },
    paddingX: spacing[3],
    radius: radius.md,
  },
} as const;

export const keyframes = {
  bounce: {
    "0%, 100%": {
      animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
      transform: "translateY(-25%)",
    },
    "50%": {
      animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
      transform: "translateY(0)",
    },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  pulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 },
  },
  scaleIn: {
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
  },
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
  slideInDown: {
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  slideInUp: {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  spin: {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
} as const;

export type Spacing = keyof typeof spacing;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type ColorGray = keyof typeof colors.gray;
export type ColorOrange = keyof typeof colors.orange;
export type Radius = keyof typeof radius;
export type Shadow = keyof typeof shadows;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;
