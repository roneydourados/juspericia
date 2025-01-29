<template>
  <v-app>
    <LayoutDrawer
      :drawer="drawer"
      :mobile="mobile"
      @update:drawer="drawer = $event"
    />

    <v-app-bar color="primary" elevation="0">
      <template #title>
        <Logo height="30" />
      </template>

      <!-- <span v-if="!mobile" class="text-h6">{{ $currentScreen }}</span> -->
      <v-spacer v-if="!mobile" />

      <v-app-bar-nav-icon
        v-if="mobile"
        variant="text"
        color="white"
        @click.stop="drawer = !drawer"
      />
      <template v-slot:append>
        <div
          v-if="$currentUser?.Profile.type === 'ADVOGADO'"
          class="d-flex align-center px-4"
          style="gap: 0.5rem"
        >
          <v-btn
            class="text-none"
            color="success"
            size="small"
            :variant="mobile ? 'text' : 'flat'"
            prepend-icon="mdi-cash-plus"
            @click="router.push('/services-packages')"
          >
            <span v-if="!mobile"> Comprar créditos </span>
            <v-tooltip
              v-if="mobile"
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Comprar créditos
            </v-tooltip>
          </v-btn>

          <v-btn
            class="text-none"
            color="info"
            size="small"
            :variant="mobile ? 'text' : 'flat'"
            prepend-icon="mdi-cart-plus"
            @click="handleNewSolicitation"
          >
            <span v-if="!mobile"> Nova solicitação </span>
            <v-tooltip
              v-if="mobile"
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Nova solicitação
            </v-tooltip>
          </v-btn>
        </div>
        <v-btn
          :icon="
            $currentTheme === MAIN_THEME
              ? 'mdi-weather-sunny'
              : 'mdi-weather-night'
          "
          variant="tonal"
          size="small"
          class="mr-4"
          @click="toggleTheme"
        >
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="container d-flex justify-center">
      <div
        class="w-100 pa-4"
        style="background-color: rgb(var(--v-theme-background)) !important"
      >
        <slot />
      </div>
    </v-main>
    <v-footer app name="footer" height="30">
      <span class="text-caption">
        &copy; Yenor Code - {{ new Date().getFullYear() }}
      </span>
      <v-spacer></v-spacer>
      <span class="text-caption font-weight-bold">v{{ $version }}</span>
    </v-footer>
  </v-app>
</template>
<script setup lang="ts">
import { useThemeStore } from "@/store/theme";
import { MAIN_THEME_DARK, MAIN_THEME } from "@/utils/vuetifyTheme";
import { useDisplay, useTheme } from "vuetify";

const storeTheme = useThemeStore();
const globalTheme = useTheme();

const { mobile } = useDisplay();
// const screen = useScreenStore();
const config = useRuntimeConfig();
const router = useRouter();
const auth = useAuthStore();

const drawer = ref(true);

// const $currentScreen = computed(() => screen.$currentScreen);
const $currentUser = computed(() => auth.$currentUser);
const $version = computed(() => config.public.version);
const $currentTheme = computed(() => storeTheme.$theme);

onMounted(() => {
  closeDrawer();
});

const closeDrawer = () => {
  if (mobile.value) {
    drawer.value = false;
  }
};

const handleNewSolicitation = async () => {
  await router.push("/solicitations/new");
};

const toggleTheme = () => {
  storeTheme.storeTheme(
    globalTheme.global.name.value === MAIN_THEME ? MAIN_THEME_DARK : MAIN_THEME
  );

  globalTheme.global.name.value =
    globalTheme.global.name.value === MAIN_THEME ? MAIN_THEME_DARK : MAIN_THEME;

  storeTheme.getTheme();
};
</script>
