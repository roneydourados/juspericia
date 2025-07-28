import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as directives from "vuetify/directives";
import { MAIN_THEME } from "@/app/utils/vuetifyTheme";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme,
        mainThemeDark,
      },
      // add color variations
      variations: {
        colors: ["primary", "secondary"],
        lighten: 3,
        darken: 3,
      },
    },
    directives,
  });
  app.vueApp.use(vuetify);
});
