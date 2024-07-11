import { ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#E5E5E5",
  primary: "#0000",
  warning: "#FEAA09",
};

export const MAIN_THEME = "mainTheme";

// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: MainThemeColors,
};
