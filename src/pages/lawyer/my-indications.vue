<template>
  <LawyerMyIndications />
</template>

<script setup lang="ts">
import moment from "moment";

const indicationStore = useUserIndicationStore();

await useAsyncData(async () => {
  const initialDate = moment().startOf("month").format("YYYY-MM-DD");
  const finalDate = moment().endOf("month").format("YYYY-MM-DD");

  await indicationStore.index({ initialDate, finalDate });
});
</script>
