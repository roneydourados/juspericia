<template>
  <ConsultationTable />
</template>

<script setup lang="ts">
import { on } from "nodemailer/lib/ses-transport";

const consutationStore = useConsultationStore();

onMounted(async () => {
  await consutationStore.index("");
});
//await useAsyncData(async () => await consutationStore.index(""));
</script>
