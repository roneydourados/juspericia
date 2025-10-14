import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as directives from "vuetify/directives";
import { MAIN_THEME } from "@/utils/vuetifyTheme";
import * as labs from "vuetify/labs/components";
import * as components from "vuetify/components";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      ...labs,
    },

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
    defaults: {
      VApp: {
        style: "font-family: 'Montserrat', sans-serif;",
      },
    },
    // display: {
    //   mobileBreakpoint: 'sm',
    //   thresholds: {
    //     xs: 0,
    //     sm: 340,
    //     md: 540,
    //     lg: 800,
    //     xl: 1280,
    //   },
    // },
    directives,
  });
  app.vueApp.use(vuetify);
});
