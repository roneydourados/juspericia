<template>
  <LawyerEstatisticsDashboard />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const userLawyer = useUserLawyerStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = moment().startOf("year").format("YYYY-MM-DD");
    const finalDate = moment().endOf("year").format("YYYY-MM-DD");

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
