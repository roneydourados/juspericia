<template>
  <ComisstionTable />
</template>
<script setup lang="ts">
import dayjs from "dayjs";

const comission = useComissionStore();

onMounted(async () => {
  const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

  await comission.index({
    initialDate,
    finalDate,
  });
});
</script>
