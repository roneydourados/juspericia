<template>
  <HomeStart />
  <CardMenu :cardItems="cardItems" />
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
    title: "Laudos médicos",
    subtitle: "Verifique os laudos médicos emitidos por você.",
    icon: "mdi-hospital-box-outline",
    to: "/medical-report",
  },
  {
    title: "Minha Conta",
    subtitle: "Verifique seus dados pessoais e/ou de acesso.",
    icon: "mdi-card-account-details-outline",
    to: "/medic/my-account",
  },
];
</script>
