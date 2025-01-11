<template>
  <div>
    <v-card flat rounded="lg">
      <Table
        title="Top 10 solicitações concluídas"
        :headers="headers"
        :items="$estatistics?.laywerSolicitationsTop10Finished"
        :items-per-page="10"
        :showCrud="false"
      >
        <template #item.dateOpen="{ item }">
          {{ item.dateOpen ? moment(item.dateOpen).format("DD/MM/YYYY") : "-" }}
        </template>
        <template #item.dateClose="{ item }">
          {{
            item.dateClose ? moment(item.dateClose).format("DD/MM/YYYY") : "-"
          }}
        </template>
      </Table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
const userLawyer = useUserLawyerStore();
const $estatistics = computed(() => userLawyer.$estatistics);

const headers = ref([
  {
    title: "Tipo de consulta",
    key: "consultationName",
  },
  {
    title: "Paciente",
    key: "patient",
  },
  {
    title: "Data de abertura",
    key: "dateOpen",
  },
  {
    title: "Data de fechamento",
    key: "dateClose",
  },
  {
    title: "Finalidade",
    key: "reportPurpose",
  },
  {
    title: "Tipo de benefício",
    key: "benefitType",
  },
]);
</script>
