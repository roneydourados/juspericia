<template>
  <TransactionsTable />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const transactionsStore = useTransactionsStore();

onMounted(async () => {
  await transactionsStore.getTransactions({
    initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  });
});
</script>
