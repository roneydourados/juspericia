<template>
  <LawyerEstatisticsDashboard />
</template>

<script setup lang="ts">
import moment from "moment";

const userLawyer = useUserLawyerStore();

const initialDate = moment().startOf("year").format("YYYY-MM-DD");
const finalDate = moment().endOf("year").format("YYYY-MM-DD");

await useAsyncData(async () => {
  await userLawyer.getEstatistics({
    initialDate,
    finalDate,
  });
});
</script>
