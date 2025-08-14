<template>
  <v-app>
    <LayoutDrawer
      :drawer="drawer"
      :mobile="mobile"
      @update:drawer="drawer = $event"
    />

    <v-app-bar elevation="0" class="toolbar-color" border="0">
      <template #title>
        <div class="d-flex align-center text-white">
          <div v-if="$isDevelop" class="text-h4 text-center w-100">
            ( DEMONSTRAÇÃO )
          </div>
        </div>
      </template>
      <v-app-bar-nav-icon
        v-if="mobile"
        variant="text"
        color="white"
        @click.stop="drawer = !drawer"
      />
      <template v-slot:append>
        <div
          v-if="$currentUser?.profile?.type === 'ADVOGADO'"
          class="d-flex align-center px-4"
          style="gap: 0.5rem"
        >
          <Button
            class="text-none"
            color="colorIcon"
            size="small"
            :variant="mobile ? 'text' : 'outlined'"
            @click="router.push('/services-packages')"
          >
            <span v-if="!mobile" class="text-caption text-white">
              Comprar créditos
            </span>
            <v-icon icon="mdi-cash-plus" color="colorIcon" end />
            <v-tooltip
              v-if="mobile"
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Comprar créditos
            </v-tooltip>
          </Button>

          <Button
            class="text-none"
            color="#2B4BAD"
            size="small"
            :variant="mobile ? 'text' : 'flat'"
            @click="handleNewSolicitation"
          >
            <span v-if="!mobile" class="text-caption"> Nova solicitação </span>
            <v-icon icon="mdi-cart-plus" color="colorIcon" end />
            <v-tooltip
              v-if="mobile"
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Nova solicitação
            </v-tooltip>
          </Button>
        </div>
        <v-avatar size="40" color="black" variant="tonal">
          <v-icon icon="mdi-account-outline" color="white" />
        </v-avatar>
        <div v-if="!mobile" class="d-flex flex-column px-2 text-white">
          <span>
            {{ $currentUser?.name }}
          </span>
          <span class="">
            {{ $currentUser?.profile?.profileName }}
          </span>
        </div>
      </template>
    </v-app-bar>
    <v-main class="container d-flex justify-center">
      <div
        class="w-100 pa-4"
        style="background-color: rgb(var(--v-theme-background)) !important"
      >
        <slot />
        <SuportButton />
      </div>
    </v-main>
    <v-footer app name="footer" height="30">
      <span class="text-caption">
        &copy; GaleCode - {{ new Date().getFullYear() }}
      </span>
      <v-spacer></v-spacer>
      <span class="text-caption font-weight-bold">v{{ $version }}</span>
    </v-footer>
  </v-app>
</template>
<script setup lang="ts">
// import { useThemeStore } from "@/store/theme";
// import { MAIN_THEME_DARK, MAIN_THEME } from "@/utils/vuetifyTheme";
import { useDisplay } from "vuetify";

// const storeTheme = useThemeStore();
// const globalTheme = useTheme();

const { mobile } = useDisplay();
// const screen = useScreenStore();
const config = useRuntimeConfig();
const router = useRouter();
const auth = useAuthStore();
//const { getInitials } = useUtils();

const drawer = ref(true);

// const $currentScreen = computed(() => screen.$currentScreen);
const $currentUser = computed(() => auth.$currentUser);
const $version = computed(() => config.public.version);
const $isDevelop = computed(() => config.public.develop);
// const $currentTheme = computed(() => storeTheme.$theme);

// const $user = computed(() => {
//   const initials = getInitials(auth.$currentUser?.name!);
//   return {
//     ...auth.$currentUser,
//     initials,
//   };
// });

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

// const toggleTheme = () => {
//   storeTheme.storeTheme(
//     globalTheme.global.name.value === MAIN_THEME ? MAIN_THEME_DARK : MAIN_THEME
//   );

//   globalTheme.global.name.value =
//     globalTheme.global.name.value === MAIN_THEME ? MAIN_THEME_DARK : MAIN_THEME;

//   storeTheme.getTheme();
// };
</script>

<style scoped>
.toolbar-color {
  background: linear-gradient(to right, #1e3c98, #4d84d5) !important;
}
</style>
