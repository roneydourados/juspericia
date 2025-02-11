<template>
  <DashboardAdmin />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import moment from "moment";

const dash = useAdminDashboardSalesStore();

const loading = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    await dash.index({
      initialDate: moment().format("YYYY-MM-DD"),
      finalDate: moment().format("YYYY-MM-DD"),
    });
  } finally {
    loading.value = false;
  }
});
</script>
