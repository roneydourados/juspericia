<template>
  <VoucherTable />
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const vouchers = useVoucherStore();
onMounted(async () => {
  const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

  await vouchers.index({
    initialDate,
    finalDate,
  });
});
</script>
