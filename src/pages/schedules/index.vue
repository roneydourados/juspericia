<template>
  <ScheduleTable />
</template>
<script setup lang="ts">
import moment from "moment";

const scheduleStore = useScheduleStore();

await useAsyncData(async () => {
  await scheduleStore.index({
    scheduleDate: moment().format("YYYY-MM-DD"),
  });
});
</script>
