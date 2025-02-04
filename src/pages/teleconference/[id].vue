<template>
  <CallQuery :solicitation="$single" />
</template>

<script setup lang="ts">
definePageMeta({
  title: "Consulta online",
  description: "Telemedicina consulta online",
  layout: "register",
  middleware: undefined,
});
</script>
