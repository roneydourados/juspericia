import { ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#fafafa",
  primary: "#263238",
  pink: "#FA00FF",
  inputColor: "#1E88E5",
  warning: "#FEAA09",
  info: "#2196F3",
  green: "#4CAF50",
  tooltipColor: "#E3F2FD",
  tooltipTextColor: "#424242",
  backMenu: "#37474f",
  itemMenu: "#fff",
};

export const MAIN_THEME = "mainTheme";

// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: MainThemeColors,
};
