<template>
  <div class="pa-12">
    <HomeStart />
    <CardMenu :cardItems="cardItems" />
  </div>
</template>

<script setup lang="ts">
const cardItems = [
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
  {
    title: "Indicações",
    subtitle: "Verifique as indicações feitas pelos advogados.",
    icon: "mdi-account-network-outline",
    to: "/admin/indications",
  },
  {
    title: "Pacotes",
    subtitle:
      "Cadastro de pacote de consultas. Gestão de pacotes de consultas possibilita a venda de consultas em lote e com preço mais acessível ao escritório.",
    icon: "mdi-package-variant-closed-plus",
    to: "/admin/packages",
  },
  {
    title: "Dashboard de vendas",
    subtitle: "Verifique as estatísticas de vendas.",
    icon: "mdi-chart-arc",
    to: "/admin/dashobard-sales",
  },
  {
    title: "Laudos médicos",
    subtitle: "Analíse as estatísticas de laudos médicos.",
    icon: "mdi-hospital-box-outline",
    to: "/medical-report",
  },
];
</script>
