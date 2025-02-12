<template>
  <DashboardAdmin />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import moment from "moment";

const dash = useUserAdminStore();

const loading = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    await dash.getDashboardSales({
      initialDate: moment().format("YYYY-MM-DD"),
      finalDate: moment().format("YYYY-MM-DD"),
    });
  } finally {
    loading.value = false;
  }
});
</script>
