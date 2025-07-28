<template>
  <UserAdminTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const userAdminStore = useUserAdminStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await userAdminStore.index("");
  } finally {
    loading.value = false;
  }
});

// await useAsyncData(async () => {
//   await userAdminStore.index("");
// });
</script>
