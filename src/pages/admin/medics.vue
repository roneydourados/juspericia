<template>
  <MedicAbas />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const medicStore = useMedicStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await medicStore.index("");
  } finally {
    loading.value = false;
  }
});
//await useAsyncData(async () => await medicStore.index(""));
</script>
