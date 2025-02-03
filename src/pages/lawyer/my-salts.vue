<template>
  <LawyerMySalts />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import moment from "moment";

const saltCredit = useUserCreditSaltStore();

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const initialDate = moment().startOf("month").format("YYYY-MM-DD");
    const finalDate = moment().endOf("month").format("YYYY-MM-DD");

    await saltCredit.index({ initialDate, finalDate, status: "CONFIRMED" });
  } finally {
    loading.value = false;
  }
});

// await useAsyncData(async () => {
//   const initialDate = moment().startOf("month").format("YYYY-MM-DD");
//   const finalDate = moment().endOf("month").format("YYYY-MM-DD");

//   await saltCredit.index({ initialDate, finalDate, status: "CONFIRMED" });
// });
</script>
