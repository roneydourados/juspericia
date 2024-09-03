<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
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
