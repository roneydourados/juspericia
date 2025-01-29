<template>
  <LawyerMySalts />
</template>

<script setup lang="ts">
import moment from "moment";

const saltCredit = useUserCreditSaltStore();

await useAsyncData(async () => {
  const initialDate = moment().startOf("month").format("YYYY-MM-DD");
  const finalDate = moment().endOf("month").format("YYYY-MM-DD");

  await saltCredit.index({ initialDate, finalDate, status: "CONFIRMED" });
});
</script>
