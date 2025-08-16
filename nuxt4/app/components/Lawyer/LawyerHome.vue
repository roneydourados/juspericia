<template>
  <HomeStart />
  <CardMenu :cardItems="cardItems" />
</template>

<script setup lang="ts">
const cardItems = [
  {
    title: "Pacientes",
    subtitle:
      "Começe por aqui, cadastre um novo paciente para solicitar consultas.",
    icon: "mdi-clipboard-account-outline",
    to: "/patient",
  },
  {
    title: "Nova Solicitação",
    subtitle:
      "Já tem paciente cadastrado ? Então começe por aqui, crie uma nova solicitação de consulta.",
    icon: "mdi-cart-plus",
    to: "/solicitations/new",
  },
  {
    title: "Indicação",
    subtitle:
      "Indique e acumule pontos para trocar por descontos em solicitações de consultas.",
    icon: "mdi-account-network-outline",
    to: "/lawyer/my-indications",
  },
  {
    title: "Pacotes",
    subtitle: "Adquira pacotes de consultas e ganhe descontos especiais.",
    icon: "mdi-cart-arrow-up",
    to: "/services-packages",
  },
  {
    title: "Meus Saldos",
    subtitle:
      "De uma conferida no seu saldo em créditos de compra de pacotes de serviços.",
    icon: "mdi-chart-line-variant",
    to: "/lawyer/my-salts",
  },
  {
    title: "Estatísticas",
    subtitle: "Análise suas estatísticas de uso da plataforma.",
    icon: "mdi-view-dashboard-outline",
    to: "/lawyer/estatistics",
  },
];
</script>
