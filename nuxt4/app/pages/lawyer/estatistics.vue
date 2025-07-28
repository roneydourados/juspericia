<template>
  <LawyerEstatisticsDashboard />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";

const userLawyer = useUserLawyerStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = dayjs().startOf("year").format("YYYY-MM-DD");
    const finalDate = dayjs().endOf("year").format("YYYY-MM-DD");

    await userLawyer.getEstatistics({
      initialDate,
      finalDate,
    });
  } finally {
    loading.value = false;
  }
});

// await useAsyncData(async () => {
//   await userLawyer.getEstatistics({
//     initialDate,
//     finalDate,
//   });
// });
</script>
