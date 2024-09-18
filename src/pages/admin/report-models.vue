<template>
  <ReportModelTable />
</template>

<script setup lang="ts">
const reportModel = useReportModelStore();
await useAsyncData(async () => await reportModel.index(""));
</script>
