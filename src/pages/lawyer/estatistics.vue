<template>
  <LawyerEstatisticsDashboard />
</template>

<script setup lang="ts">
import moment from "moment";

const userLawyer = useUserLawyerStore();

const initialDate = "2024-01-01"; //moment().format("YYYY-MM-DD");
const finalDate = "2025-12-31"; //moment().format("YYYY-MM-DD");

await useAsyncData(async () => {
  await userLawyer.getEstatistics({
    initialDate,
    finalDate,
  });
});
</script>
