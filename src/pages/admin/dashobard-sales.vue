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

  await dash.getDashboardSales({
    initialDate,
    finalDate,
  });
  // try {
  //   loading.value = true;
  //   const initialDate = dayjs().format("YYYY-MM-DD");
  //   const finalDate = dayjs().format("YYYY-MM-DD");

  //   await dash.getDashboardSales({
  //     initialDate,
  //     finalDate,
  //   });
  // } finally {
  //   loading.value = false;
  // }
});
</script>
