<template>
  <MedicHome />
</template>
<script setup lang="ts">
const medicDash = useMedicDahsboardStore();

onMounted(async () => {
  await medicDash.index();
});
</script>
