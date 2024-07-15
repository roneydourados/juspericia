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

      <span v-if="!mobile" class="text-h6">{{ $currentScreen }}</span>
      <v-spacer v-if="!mobile" />

      <v-app-bar-nav-icon
        v-if="mobile"
        variant="text"
        color="white"
        @click.stop="drawer = !drawer"
      />
    </v-app-bar>

    <v-main class="container d-flex justify-center">
      <div class="w-100 px-8 py-8">
        <slot />
      </div>
    </v-main>
    <v-footer app name="footer" color="blue-grey-lighten-5" height="30">
      <span class="text-caption">
        &copy; Yenor Code - {{ new Date().getFullYear() }}
      </span>
      <v-spacer></v-spacer>
      <span class="text-caption font-weight-bold">v{{ $version }}</span>
    </v-footer>
  </v-app>
</template>
<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const screen = useScreenStore();
const config = useRuntimeConfig();

const drawer = ref(true);
const $currentScreen = computed(() => screen.$currentScreen);
const $version = computed(() => config.public.version);

onMounted(() => {
  closeDrawer();
});

const closeDrawer = () => {
  if (mobile.value) {
    drawer.value = false;
  }
};
</script>
