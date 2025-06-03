<template>
  <ScheduleTable />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const scheduleStore = useScheduleStore();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await scheduleStore.indexForMedic({
      scheduleDate: dayjs().format("YYYY-MM-DD"),
    });
  } finally {
    loading.value = false;
  }
});
// await useAsyncData(async () => {
//   await scheduleStore.index({
//     scheduleDate: dayjs().format("YYYY-MM-DD"),
//   });
// });
</script>
