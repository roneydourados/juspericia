import { type ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#fff", //"#f5f5fa",
  primary: "#002c9b",
  bgcolor: "#fff",
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
  greenLime: "#c8e040",
  darkText: "#1A1E4E",
  colorTextPrimary: "#002c9b",
};

const MainDarkThemeColors = {
  background: "#111827",
  bgcolor: "#1F2937",
  grey: "#71717A",
  primary: "#673AB7",
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
  tooltipTextColor: "#fff",
  colorIcon: "#a0b012",
  greenLime: "#c8e040",
  darkText: "#2196F3",
  colorTextPrimary: "#FFFFFF",
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
