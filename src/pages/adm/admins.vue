<template>
  <UserAdminTable />
</template>

<script setup lang="ts">
const userAdminStore = useUserAdminStore();

useAsyncData(async () => {
  await userAdminStore.index("");
});
</script>
