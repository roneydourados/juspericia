<template>
  <UserAdminTable />
</template>

<script setup lang="ts">
const userAdminStore = useUserAdminStore();

onMounted(async () => {
  await userAdminStore.index("");
});

// await useAsyncData(async () => {
//   await userAdminStore.index("");
// });
</script>
