export const spacing = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
  52: "208px",
  56: "224px",
  60: "240px",
  64: "256px",
  72: "288px",
  80: "320px",
  96: "384px",
} as const;

export const typography = {
  fontFamily: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }],
    sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
    base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
    lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
    xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.015em" }],
    "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.025em" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.03em" }],
    "5xl": ["3rem", { lineHeight: "1", letterSpacing: "-0.035em" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
} as const;

export const colors = {
  gray: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    950: "#121212",
  },
  orange: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#FF4500",
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
  },
  vote: {
    up: "#FF4500",
    upHover: "#E03D00",
    down: "#7193FF",
    downHover: "#5A7DE8",
  },
  success: {
    light: "#ECFDF5",
    DEFAULT: "#10B981",
    dark: "#047857",
  },
  warning: {
    light: "#FFFBEB",
    DEFAULT: "#F59E0B",
    dark: "#B45309",
  },
  error: {
    light: "#FEF2F2",
    DEFAULT: "#EF4444",
    dark: "#B91C1C",
  },
  info: {
    light: "#EFF6FF",
    DEFAULT: "#3B82F6",
    dark: "#1D4ED8",
  },
} as const;

export const radius = {
  none: "0",
  sm: "4px",
  DEFAULT: "8px",
  md: "10px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
} as const;

export const shadows = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  DEFAULT: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
  glow: "0 0 20px 5px rgba(255, 69, 0, 0.15)",
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
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const layout = {
  maxWidth: {
    content: "1280px",
    narrow: "768px",
    wide: "1536px",
  },
  sidebar: {
    width: "280px",
    collapsedWidth: "72px",
  },
  header: {
    height: "64px",
  },
} as const;

export const components = {
  card: {
    padding: spacing[4],
    paddingLg: spacing[6],
    radius: radius.lg,
    shadow: shadows.sm,
    hoverShadow: shadows.md,
    border: "1px solid",
    borderColor: colors.gray[200],
    darkBorderColor: "rgba(255, 255, 255, 0.1)",
  },
  button: {
    height: {
      sm: "32px",
      md: "40px",
      lg: "48px",
    },
    paddingX: {
      sm: spacing[3],
      md: spacing[4],
      lg: spacing[6],
    },
    radius: radius.md,
    fontSize: {
      sm: typography.fontSize.xs[0],
      md: typography.fontSize.sm[0],
      lg: typography.fontSize.base[0],
    },
  },
  input: {
    height: {
      sm: "32px",
      md: "40px",
      lg: "48px",
    },
    paddingX: spacing[3],
    radius: radius.md,
    borderWidth: "1px",
  },
  avatar: {
    size: {
      xs: "24px",
      sm: "32px",
      md: "40px",
      lg: "48px",
      xl: "64px",
      "2xl": "80px",
    },
    radius: radius.full,
  },
  badge: {
    height: {
      sm: "20px",
      md: "24px",
      lg: "28px",
    },
    paddingX: {
      sm: spacing[1.5],
      md: spacing[2],
      lg: spacing[2.5],
    },
    radius: radius.full,
    fontSize: typography.fontSize.xs[0],
  },
} as const;

export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  slideInUp: {
    from: { transform: "translateY(10px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  slideInDown: {
    from: { transform: "translateY(-10px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  scaleIn: {
    from: { transform: "scale(0.95)", opacity: 0 },
    to: { transform: "scale(1)", opacity: 1 },
  },
  pulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 },
  },
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
  bounce: {
    "0%, 100%": {
      transform: "translateY(-25%)",
      animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
    },
    "50%": {
      transform: "translateY(0)",
      animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
    },
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
