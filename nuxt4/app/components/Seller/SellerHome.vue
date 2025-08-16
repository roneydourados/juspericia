<template>
  <div class="pa-12">
    <HomeStart />
    <CardMenu :cardItems="cardItems" />
  </div>
</template>

<script setup lang="ts">
const cardItems = [
  {
    title: "Agendamentos",
    subtitle: "Começe por aqui, verifique os agendamentos feitos para você.",
    icon: "mdi-clipboard-account-outline",
    to: "/schedules",
  },
  {
    title: "Solicitações",
    subtitle: "Começe por aqui, veja todas as solicitações de consulta.",
    icon: "mdi-file-document-edit-outline",
    to: "/solicitations",
  },
  {
    title: "Advogados",
    subtitle: "Veja todos os advogados cadastrados.",
    icon: "mdi-account-tie-outline",
    to: "/admin/lawyers",
  },
];
</script>
