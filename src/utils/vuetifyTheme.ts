import { ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#fafafa",
  primary: "#263238",
  pink: "#FA00FF",
  inputColor: "#1E88E5",
  warning: "#FEAA09",
};

export const MAIN_THEME = "mainTheme";

// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: MainThemeColors,
};
