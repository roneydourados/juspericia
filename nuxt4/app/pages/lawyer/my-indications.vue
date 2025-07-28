<template>
  <LawyerMyIndications />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const indicationStore = useUserIndicationStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("month").format("YYYY-MM-DD");

    await indicationStore.index({ initialDate, finalDate });
  } finally {
    loading.value = false;
  }
});
</script>
