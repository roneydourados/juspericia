<template>
  <AdminDashboardInvoicing />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const userAdmin = useUserAdminStore();

onMounted(async () => {
  const initialDate = dayjs().startOf("week").format("YYYY-MM-DD");
  const finalDate = dayjs().endOf("week").format("YYYY-MM-DD");
  await userAdmin.getDashboardInvoicing({
    initialDate,
    finalDate,
  });
});
</script>
