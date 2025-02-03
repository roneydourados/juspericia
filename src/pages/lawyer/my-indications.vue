<template>
  <LawyerMyIndications />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const indicationStore = useUserIndicationStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = moment().startOf("month").format("YYYY-MM-DD");
    const finalDate = moment().endOf("month").format("YYYY-MM-DD");

    await indicationStore.index({ initialDate, finalDate });
  } finally {
    loading.value = false;
  }
});

// await useAsyncData(async () => {
//   const initialDate = moment().startOf("month").format("YYYY-MM-DD");
//   const finalDate = moment().endOf("month").format("YYYY-MM-DD");

//   await indicationStore.index({ initialDate, finalDate });
// });
</script>
