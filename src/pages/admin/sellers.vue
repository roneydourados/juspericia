<template>
  <SellerAbas />
</template>

<script setup lang="ts">
const sellerStore = useSellerStore();

onMounted(async () => {
  await sellerStore.index("");
});
</script>
