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
const nuxtApp = useNuxtApp();

const loading = ref(false);

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
