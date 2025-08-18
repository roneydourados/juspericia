<template>
  <div class="pa-12">
    <HeaderPage title="Vídeos / tutoriais" font-size="1.8rem" />
  </div>
  <v-row>
    <v-col v-for="item in 15" cols="12" lg="4" :key="item">
      <CardBlur height="400">
        <div class="d-flex justify-center py-4">
          <video
            src="https://www.youtube.com/watch?v=RxOBOhRECoo"
            controls
            style="border-radius: 1rem"
          />
        </div>
        <div class="px-12 mb-4">
          <div class="text-primary text-h5">Serviço {{ item + 1 }}</div>
          <div class="text-primary text-caption mb-2">
            Dados informativos sobre o sistema
          </div>
          <div class="text-primary">
            Descrição detalhada do serviço prestado em questão no título deste
            card, todas as informações serão referente ao
            <strong>Serviço({{ item + 1 }})</strong>
          </div>
        </div>
      </CardBlur>
    </v-col>
  </v-row>
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
