<template>
  <AtendentAbas />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const atendentStore = useUserAtendentStore();
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await atendentStore.index("");
  } finally {
    loading.value = false;
  }
});
</script>
