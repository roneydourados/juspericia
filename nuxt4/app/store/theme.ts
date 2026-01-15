import { defineStore } from "pinia";
import { useTheme as useVuetifyTheme } from "vuetify";
import { MAIN_THEME, MAIN_THEME_DARK } from "@/utils/vuetifyTheme";

export const useThemeStore = defineStore("theme", () => {
  const vuetifyTheme = useVuetifyTheme();
  const THEME_STORAGE_KEY = "app-theme-mode";

  // Estado reativo para o tema atual
  const isDark = ref(false);
  const currentTheme = ref(MAIN_THEME);

  // Computed para expor o estado
  const $isDark = computed(() => isDark.value);
  const $currentTheme = computed(() => currentTheme.value);

  // Inicializa o tema do localStorage ou usa o padrão
  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme) {
        isDark.value = savedTheme === MAIN_THEME_DARK;
        currentTheme.value = savedTheme;
        vuetifyTheme.global.name.value = savedTheme;
      } else {
        // Usa o tema padrão
        isDark.value = false;
        currentTheme.value = MAIN_THEME;
        vuetifyTheme.global.name.value = MAIN_THEME;
      }
    }
  };

  // Alterna entre tema claro e escuro
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    const newTheme = isDark.value ? MAIN_THEME_DARK : MAIN_THEME;

    currentTheme.value = newTheme;
    vuetifyTheme.global.name.value = newTheme;

    if (process.client) {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
  };

  // Define um tema específico
  const setTheme = (themeName: string) => {
    isDark.value = themeName === MAIN_THEME_DARK;
    currentTheme.value = themeName;
    vuetifyTheme.global.name.value = themeName;

    if (process.client) {
      localStorage.setItem(THEME_STORAGE_KEY, themeName);
    }
  };

  return {
    $isDark,
    $currentTheme,
    toggleTheme,
    setTheme,
    initTheme,
  };
});
