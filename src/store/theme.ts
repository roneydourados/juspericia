import { defineStore } from "pinia";
import { MAIN_THEME } from "@/utils/vuetifyTheme";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref(MAIN_THEME);

  const $theme = computed(() => {
    return theme.value;
  });

  const storeTheme = (themeName: string) => {
    localStorage.setItem("theme", themeName);

    theme.value = themeName;
  };

  const getTheme = () => {
    theme.value = localStorage.getItem("theme") ?? MAIN_THEME;
  };

  return {
    $theme,
    storeTheme,
    getTheme,
  };
});
