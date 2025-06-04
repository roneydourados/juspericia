<template>
  <AdminDashboardInvoicing />
  <DialogLoading :dialog="loading" />
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const dash = useUserAdminStore();

const loading = ref(false);

onMounted(async () => {
  try {
    loading.value = true;
    const initialDate = dayjs().startOf("week").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("week").format("YYYY-MM-DD");

    await dash.getDashboardInvoicing({
      initialDate,
      finalDate,
    });

    // await dash.getDashboardSales({
    //   initialDate: dayjs().format("YYYY-MM-DD"),
    //   finalDate: dayjs().format("YYYY-MM-DD"),
    // });
  } finally {
    loading.value = false;
  }
});
</script>
