<template>
  <ScheduleTable />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const scheduleStore = useScheduleStore();
const auth = useAuthStore();
const loading = ref(false);

const $currentUser = computed(() => auth.$currentUser);

onMounted(async () => {
  loading.value = true;
  try {
    if ($currentUser.value?.profile?.type !== "MEDICO") {
      await scheduleStore.index({
        initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      });
    } else {
      await scheduleStore.indexForMedic({
        initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
        finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
      });
    }
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
