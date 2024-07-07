import { ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#E5E5E5",
  surface: "#343C6A",
  primary: "#2D60FF",
  secondary: "#FE5C73",
  info: "#3b82f6",
  success: "#41D4A8",
  warning: "#FEAA09",
  tooltipColor: "#E3F2FD",
  pink: "#FA00FF",
  orange: "#FC7900",
};

export const MAIN_THEME = "mainTheme";

// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: MainThemeColors,
};
