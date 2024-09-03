<template>
  <div>
    <v-card flat rounded="lg">
      <Table
        title="Top 10 solicitações concluídas"
        :headers="headers"
        :items="tempItems"
        :items-per-page="10"
        :showCrud="false"
      ></Table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const headers = ref([
  {
    title: "Título",
    key: "title",
  },
  {
    title: "Data de abertura",
    key: "dataOpen",
  },
  {
    title: "Data de fechamento",
    key: "dataClose",
  },
  {
    title: "Paciente",
    key: "patient",
  },
  {
    title: "Finalidade",
    key: "porpuse",
  },
  {
    title: "Tipo de benefício",
    key: "benefitType",
  },
]);

const tempItems = ref([
  {
    title: "Consulta por invalidez",
    dataOpen: "01/07/2024",
    dataClose: "23/07/2024",
    patient: "João da Silva",
    porpuse: "Judicial",
    benefitType: "Aposentadoria por invalidez",
  },
  {
    title: "Consulta por acidente de trabalho",
    dataOpen: "15/08/2024",
    dataClose: "20/08/2024",
    patient: "Maria Souza",
    porpuse: "Administrative",
    benefitType: "Auxílio-doença",
  },
  {
    title: "Consulta por doença ocupacional",
    dataOpen: "10/09/2024",
    dataClose: "18/09/2024",
    patient: "Pedro Santos",
    porpuse: "Judicial",
    benefitType: "Aposentadoria por invalidez",
  },
  {
    title: "Consulta por acidente de trânsito",
    dataOpen: "05/10/2024",
    dataClose: "12/10/2024",
    patient: "Ana Oliveira",
    porpuse: "Administrative",
    benefitType: "Auxílio-acidente",
  },
  {
    title: "Consulta por doença crônica",
    dataOpen: "20/11/2024",
    dataClose: "25/11/2024",
    patient: "Lucas Mendes",
    porpuse: "Judicial",
    benefitType: "Aposentadoria por invalidez",
  },
  {
    title: "Consulta por acidente doméstico",
    dataOpen: "03/12/2024",
    dataClose: "10/12/2024",
    patient: "Carla Costa",
    porpuse: "Administrative",
    benefitType: "Auxílio-doença",
  },
  {
    title: "Consulta por doença ocupacional",
    dataOpen: "15/01/2025",
    dataClose: "20/01/2025",
    patient: "Rafaela Lima",
    porpuse: "Judicial",
    benefitType: "Aposentadoria por invalidez",
  },
  {
    title: "Consulta por acidente de trabalho",
    dataOpen: "10/02/2025",
    dataClose: "18/02/2025",
    patient: "Gustavo Almeida",
    porpuse: "Administrative",
    benefitType: "Auxílio-acidente",
  },
  {
    title: "Consulta por doença crônica",
    dataOpen: "05/03/2025",
    dataClose: "12/03/2025",
    patient: "Fernanda Silva",
    porpuse: "Judicial",
    benefitType: "Aposentadoria por invalidez",
  },
  {
    title: "Consulta por acidente de trânsito",
    dataOpen: "20/04/2025",
    dataClose: "25/04/2025",
    patient: "Mariana Santos",
    porpuse: "Administrative",
    benefitType: "Auxílio-doença",
  },
]);
</script>
