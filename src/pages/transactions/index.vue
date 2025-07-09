<template>
  <TransactionsTable />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const userAdmin = useUserAdminStore();

onMounted(async () => {
  const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");
  await userAdmin.getTransactions({
    initialDate,
    finalDate,
  });
});
</script>
