import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: false,
  css: [
    "notivue/notification.css", // Only needed if using built-in notifications
    "notivue/animations.css", // Only needed if using built-in animations
    "@/assets/styles/main.css",
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
    "nuxt-tiptap-editor",
    "@nuxtjs/turnstile",
  ],
  tiptap: {
    prefix: "Tiptap", //prefix for Tiptap imports, composables not included
  },
  imports: {
    dirs: ["store", "types"],
  },
  app: {
    head: {
      title: "Juspericia",
      titleTemplate: "Juspericia",
      script: [
        {
          src: "https://challenges.cloudflare.com/turnstile/v0/api.js",
          async: true,
          defer: true,
        },
      ],
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  notivue: {
    limit: 4,
    enqueue: true,
    avoidDuplicates: true,
    position: "top-right",
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
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./app", import.meta.url)),
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  // typescript: {
  //   tsConfig: {
  //     compilerOptions: {
  //       target: "es2021",
  //       verbatimModuleSyntax: false,
  //       paths: {
  //         "@/*": ["./*"],
  //         "@/app/*": ["./app/*"],
  //         "@/server/*": ["./server/*"],
  //       },
  //     },
  //   },
  // },
  turnstile: {
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY,
    addValidateEndpoint: true,
  },
  runtimeConfig: {
    s3: {
      secretAccessKeyId: process.env.S3_ACCESS_KEYID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      bucketName: process.env.S3_BUCKET ?? "",
      region: process.env.S3_REGION ?? "",
    },
    emailProvider: {
      host: process.env.MAIL_HOST ?? "",
      port: process.env.MAIL_PORT ?? "",
      user: process.env.MAIL_USER ?? "",
      pass: process.env.MAIL_PASS ?? "",
    },
    tokenSecret: process.env.JWT_SECRET ?? "",
    zegoCloudAppSecret: process.env.ZEGOCLOUD_SECRET ?? "",
    zegoCloudAppId: process.env.ZEGOCLOUD_APP_ID ?? "0",
    asaasApikey: process.env.ASAAS_API_KEY ?? "",
    asaasBaseUrl: process.env.ASAAS_BASE_URL ?? "",
    turnstile: {
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
    public: {
      zapSignUrl:
        process.env.ZAPSIGN_VERIFICAR_URL ??
        "https://sandbox.app.zapsign.com.br",
      zapsignApiToken: process.env.ZAPSIGN_API_TOKEN ?? "",
      apiBaseUrl: process.env.API_BASE_URL ?? "",
      appUrl: process.env.APP_URL,
      version: process.env.VERSION ?? "",
      develop: process.env.DEVELOP === "true" ? true : false,
    },
  },
});
