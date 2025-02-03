<template>
  <ReportModelTable />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const reportModel = useReportModelStore();
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    await reportModel.index("");
  } finally {
    loading.value = false;
  }
});
//await useAsyncData(async () => await reportModel.index(""));
</script>
