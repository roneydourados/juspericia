<template>
  <SolicitationForm show :data="$sigle" />
</template>

<script setup lang="ts">
const storeConsultation = useSolicitationConsultationStore();
const $sigle = computed(() => storeConsultation.$single);
</script>
