<template>
  <pre>{{ $all }}</pre>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const expense = useFinanceStore();

const filters = ref<FinanceFiltersProps>({
  initialDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  finalDate: dayjs().endOf("month").format("YYYY-MM-DD"),
  financeType: "expense",
  status: "",
});

onMounted(async () => {
  await expense.index(filters.value);
});

const $all = computed(() => expense.$all);
</script>
