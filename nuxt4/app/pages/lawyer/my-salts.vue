<template>
  <LawyerMySalts />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const saltCredit = useUserCreditSaltStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await saltCredit.index({ status: "CONFIRMED" });
  } finally {
    loading.value = false;
  }
});
</script>
