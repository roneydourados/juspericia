<template>
  <ReportModelTable />
</template>

<script setup lang="ts">
const reportModel = useReportModelStore();

onMounted(async () => {
  await reportModel.index("");
});
//await useAsyncData(async () => await reportModel.index(""));
</script>
