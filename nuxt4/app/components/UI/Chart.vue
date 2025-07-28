<template>
  <apexchart
    :type="type"
    :options="chartOptions"
    :series="series"
    :height="height"
  />
</template>

<script setup lang="ts">
defineProps({
  chartOptions: Object,
  type: String,
  series: Array,
  height: String,
});
</script>
