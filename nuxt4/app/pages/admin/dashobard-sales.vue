<template>
  <DashboardAdmin />
  <!-- <DialogLoading :dialog="loading" /> -->
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const dash = useUserAdminStore();

//const loading = ref(false);

onMounted(async () => {
  const initialDate = dayjs().format("YYYY-MM-DD");
  const finalDate = dayjs().format("YYYY-MM-DD");
  const yearInvoice = dayjs().year();

  await dash.getDashboardSales({
    initialDate,
    finalDate,
    ufs: [],
    yearInvoice,
  });
});
</script>
