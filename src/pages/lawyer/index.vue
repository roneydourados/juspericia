<template>
  <UserLawyerTable />
</template>

<script setup lang="ts">
const userLawyerStore = useUserLawyerStore();

useAsyncData(async () => {
  await userLawyerStore.index("");
});
</script>
