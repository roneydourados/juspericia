<template>
  <!-- <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue> -->

  <Notivue v-slot="item">
    <ModalNotification :item="item" />
  </Notivue>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import { useTheme } from "vuetify";
const nuxtApp = useNuxtApp();

const globalTheme = useTheme();
const storeTheme = useThemeStore();

const loading = ref(false);

const theme = computed(() => {
  return storeTheme.$theme;
});

onMounted(() => {
  storeTheme.getTheme();

  globalTheme.global.name.value = theme.value;
});

nuxtApp.hook("page:start", () => {
  loading.value = true;
});
nuxtApp.hook("page:finish", () => {
  loading.value = false;
});
</script>

<style>
.Notivue__notification {
  z-index: 3000 !important; /* ou qualquer valor maior que o z-index do app-bar */
}

.notivue-notification {
  z-index: 2000; /* Ajuste conforme necessário */
}
</style>
