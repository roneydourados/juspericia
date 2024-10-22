import { type ThemeDefinition } from "vuetify";

export const MainThemeColors = {
  background: "#f5f5fa",
  primary: "#5D5FEF",
  success: "#10B981",
  danger: "#F43F5E",
  darkButton: "#334155",
  wharning: "#E07706",
  info: "#178DCC",
  purple: "#5574ED",
  surface: "#FFFFFF",
  itemMenu: "#ffffff",
  itemInternalMenu: "#000",
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

// import { ThemeDefinition } from "vuetify";

// export const MainThemeColors = {
//   background: "#fafafa",
//   primary: "#263238",
//   pink: "#FA00FF",
//   inputColor: "#1E88E5",
//   warning: "#FEAA09",
//   info: "#2196F3",
//   green: "#4CAF50",
//   tooltipColor: "#E3F2FD",
//   tooltipTextColor: "#424242",
//   backMenu: "#37474f",
//   itemMenu: "#fff",
// };

// export const MAIN_THEME = "mainTheme";

// // Light mode theme
// export const mainTheme: ThemeDefinition = {
//   dark: false,
//   colors: MainThemeColors,
// };
