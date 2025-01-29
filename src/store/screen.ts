import { defineStore } from "pinia";

export const useScreenStore = defineStore("screen", () => {
  const screen = ref("");
  const $currentScreen = computed(() => screen.value);

  const setScreen = (value: string) => {
    screen.value = value;
  };

  return {
    $currentScreen,
    setScreen,
  };
});
