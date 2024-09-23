<template>
  <LawyerMySalts />
</template>

<script setup lang="ts">
const saltCredit = useUserCreditSaltStore();

await useAsyncData(async () => {
  await saltCredit.index({});
});
</script>
