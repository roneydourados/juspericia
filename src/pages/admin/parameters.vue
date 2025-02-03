<template>
  <Parameters />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const systemParametersStore = useSystemParametersStore();

const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await systemParametersStore.index();
  } finally {
    loading.value = false;
  }
});
//await useAsyncData(async () => await systemParametersStore.index());
</script>
