<template>
  <ScheduleTable />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import moment from "moment";

const auth = useAuthStore();
const scheduleStore = useScheduleStore();

const $currentUser = computed(() => auth.$currentUser);

const loading = ref(false);
// se for médico sempre passar ele
const medicId =
  $currentUser.value?.profile?.type === "MEDICO"
    ? $currentUser.value?.id
    : undefined;

onMounted(async () => {
  loading.value = true;
  try {
    await scheduleStore.index({
      scheduleDate: moment().format("YYYY-MM-DD"),
      medicId,
    });
  } finally {
    loading.value = false;
  }
});
// await useAsyncData(async () => {
//   await scheduleStore.index({
//     scheduleDate: moment().format("YYYY-MM-DD"),
//     medicId,
//   });
// });
</script>
