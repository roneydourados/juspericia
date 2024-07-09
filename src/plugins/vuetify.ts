import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { MAIN_THEME } from "@/utils/vuetifyTheme";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
      },
      // add color variations
      variations: {
        colors: ["primary", "secondary"],
        lighten: 3,
        darken: 3,
      },
    },
  });
  app.vueApp.use(vuetify);
});
