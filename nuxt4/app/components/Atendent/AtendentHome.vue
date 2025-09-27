<template>
  <div class="pa-12">
    <HomeStart />
    <CardMenu :cardItems="cardItems" />
  </div>
</template>

<script setup lang="ts">
const cardItems = [
  {
    title: "Laudos médicos",
    subtitle:
      "Começe por aqui, verifique os laudos médicos a serem confecionados.",
    icon: "mdi-file-document-edit-outline",
    to: "/schedules",
  },
];
</script>
