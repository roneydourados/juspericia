import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

const rateLimiter = {
  interval: 300000,
  tokensPerInterval: 150,
  throwError: true,
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,
  css: [
    "notivue/notification.css", // Only needed if using built-in notifications
    "notivue/animations.css", // Only needed if using built-in animations
  ],
  components: [{ path: "@/components", pathPrefix: false }],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "notivue/nuxt",
    "@pinia/nuxt",
    "nuxt-security",
  ],
  imports: {
    dirs: ["store", "types"],
  },
  app: {
    head: {
      title: "App Title",
      titleTemplate: "App Title",
      // meta: [
      //   {
      //     name: "theme-color",
      //     content: pwaTheme,
      //   },
      // ],
    },
    //pageTransition: { name: "page", mode: "out-in" },
    //layoutTransition: { name: "default", mode: "out-in" },
  },
  build: {
    transpile: ["vuetify"],
  },
  //configurar depois
  // security: {
  //   corsHandler: {
  //     origin: process.env.APP_URL,
  //     methods: ["GET", "POST", "PUT", "DELETE"],
  //   },
  // },
  // routeRules: {
  //   "/api/auth/register": {
  //     security: {
  //       rateLimiter,
  //     },
  //   },
  //   "/api/auth/active": {
  //     security: {
  //       rateLimiter,
  //     },
  //   },
  //   "/api/auth/login": {
  //     security: {
  //       rateLimiter,
  //     },
  //   },
  // },
  notivue: {
    limit: 4,
    enqueue: true,
    avoidDuplicates: true,
    position: "bottom-center",
    notifications: {
      global: {
        duration: 3000,
      },
      info: {
        title: "Informação!",
      },
      success: {
        title: "Sucesso!",
      },
      error: {
        title: "Erro!",
      },
      warning: {
        title: "Atenção!",
      },
    },
  },
  vite: {
    //logLevel: "info",
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        target: "es2021",
        verbatimModuleSyntax: false,
        paths: {
          "@/*": ["./*"],
          "@/server*": ["./server/*"],
        },
      },
    },
  },
  runtimeConfig: {
    tokenSecret: process.env.JWT_SECRET ?? "",
    public: {
      apiBaseUrl: process.env.API_BASE_URL ?? "",
    },
  },
});
