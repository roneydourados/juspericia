import { type ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#fff", //"#f5f5fa",
  primary: "#002c9b",
  success: "#10B981",
  danger: "#F43F5E",
  darkButton: "#334155",
  wharning: "#E07706",
  info: "#178DCC",
  purple: "#5574ED",
  surface: "#FFFFFF",
  itemMenu: "#ffffff",
  itemInternalMenu: "#000",
  tooltipColor: "#E3F2FD",
  tooltipTextColor: "#424242",
  colorIcon: "#C7D82F",
  darkText: "#1A1E4E",
};

const MainDarkThemeColors = {
  background: "#141625",
  primary: "#5D5FEF",
  success: "#10B981",
  danger: "#e11d48",
  darkButton: "#334155",
  wharning: "#E07706",
  info: "#178DCC",
  purple: "#5574ED",
  surface: "#1E223B",
  itemMenu: "#FFFFFF",
  itemInternalMenu: "#ffffff",
  tooltipColor: "#E3F2FD",
  tooltipTextColor: "#424242",
  colorIcon: "#C7D82F",
  darkText: "#1A1E4E",
};

export const MAIN_THEME = "mainTheme";
export const MAIN_THEME_DARK = "mainThemeDark";

// Light mode theme
export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: MainThemeColors,
};

// Dark mode theme
export const mainThemeDark: ThemeDefinition = {
  dark: true,
  colors: MainDarkThemeColors,
};
