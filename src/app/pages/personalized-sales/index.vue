<template>
  <UserPersonalizedSalesTable />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const sales = useSaleStore();
const auth = useAuthStore();

const $currentUser = computed(() => auth.$currentUser);

onMounted(async () => {
  const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

  await sales.getSalesUser({
    initialDate,
    finalDate,
    userId: $currentUser.value!.id!,
    saleType: "manual",
  });
});
</script>
