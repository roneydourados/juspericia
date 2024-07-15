import { ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#fafafa",
  primary: "#263238",
  warning: "#FEAA09",
};

export const MAIN_THEME = "mainTheme";

// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: MainThemeColors,
};
