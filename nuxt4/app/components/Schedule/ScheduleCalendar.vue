<template>
  <pre>{{ $scheduleEvents }}</pre>
</template>

<script setup lang="ts">
const shedule = useScheduleStore();

const $scheduleEvents = computed(() => shedule.$scheduleEvents);

onMounted(async () => {
  await shedule.indexEvents(10);
});
</script>

<style scoped></style>
