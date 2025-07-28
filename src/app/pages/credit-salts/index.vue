<template>
  <AdminCreditSalts />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const saltCredit = useUserCreditSaltStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await saltCredit.indexAdmin({ status: "CONFIRMED", isSalt: true });
  } finally {
    loading.value = false;
  }
});
</script>
