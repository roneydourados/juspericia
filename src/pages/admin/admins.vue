<template>
  <UserAdminTable />
</template>

<script setup lang="ts">
const userAdminStore = useUserAdminStore();

await useAsyncData(async () => {
  await userAdminStore.index("");
});
</script>
