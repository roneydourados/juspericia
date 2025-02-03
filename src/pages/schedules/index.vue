<template>
  <ScheduleTable />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import moment from "moment";

const scheduleStore = useScheduleStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await scheduleStore.index({
      scheduleDate: moment().format("YYYY-MM-DD"),
    });
  } finally {
    loading.value = false;
  }
});
// await useAsyncData(async () => {
//   await scheduleStore.index({
//     scheduleDate: moment().format("YYYY-MM-DD"),
//   });
// });
</script>
