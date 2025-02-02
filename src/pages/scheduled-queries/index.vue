<template>
  <ScheduleTable />
</template>
<script setup lang="ts">
import moment from "moment";

const auth = useAuthStore();
const scheduleStore = useScheduleStore();

const $currentUser = computed(() => auth.$currentUser);

// se for médico sempre passar ele
const medicId =
  $currentUser.value?.Profile?.type === "MEDICO"
    ? $currentUser.value?.id
    : undefined;

onMounted(async () => {
  await scheduleStore.index({
    scheduleDate: moment().format("YYYY-MM-DD"),
    medicId,
  });
});
// await useAsyncData(async () => {
//   await scheduleStore.index({
//     scheduleDate: moment().format("YYYY-MM-DD"),
//     medicId,
//   });
// });
</script>
