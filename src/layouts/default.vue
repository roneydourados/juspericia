<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <LayoutDrawer
        :drawer="drawer"
        :mobile="mobile"
        @update:drawer="drawer = $event"
      />

      <v-app-bar color="primary" title="Application bar drawer" elevation="0">
        <template #title>
          <Logo height="30" />
        </template>

        <v-app-bar-nav-icon
          v-if="mobile"
          variant="text"
          color="white"
          @click.stop="drawer = !drawer"
        />
      </v-app-bar>

      <v-main class="d-flex justify-center" style="min-height: 300px">
        <div class="w-100 px-8 py-8">
          <slot />
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>
<script setup lang="ts">
import { useDisplay } from "vuetify";
const drawer = ref(true);

const { mobile } = useDisplay();

onMounted(() => {
  closeDrawer();
});

const closeDrawer = () => {
  if (mobile.value) {
    drawer.value = false;
  }
};
</script>

<style scoped></style>
