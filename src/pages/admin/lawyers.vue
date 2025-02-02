<template>
  <LawyerTable />
</template>

<script setup lang="ts">
const userLawyerStore = useUserLawyerStore();

onMounted(async () => {
  await userLawyerStore.index("");
});
//await useAsyncData(async () => await userLawyerStore.index(""));
</script>
