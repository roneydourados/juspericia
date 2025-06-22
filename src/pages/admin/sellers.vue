<template>
  <SellerAbas />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const sellerStore = useSellerStore();
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await sellerStore.index("");
  } finally {
    loading.value = false;
  }
});
</script>
