<template>
  <CardBlur>
    <Table
      title="Top 10 solicitações concluídas"
      :headers="headers"
      :items="$estatistics?.laywerSolicitationsTop10Finished"
      :items-per-page="10"
      :showCrud="false"
    >
      <template #item.patient="{ item }">
        <v-list density="compact">
          <v-list-item>
            <template v-slot:title>
              <v-row dense>
                <v-col cols="12" lg="10">
                  <span
                    >Paciente: <strong>{{ item.patient }}</strong></span
                  >
                </v-col>
                <v-col cols="12" lg="2">
                  <span>
                    Data:
                    <strong>
                      {{
                        item.dateClose
                          ? dayjs(item.dateClose).format("DD/MM/YYYY")
                          : "-"
                      }}
                    </strong>
                  </span>
                </v-col>
              </v-row>
            </template>
            <template v-slot:subtitle>
              <v-row dense>
                <v-col cols="12" lg="2">
                  <span>Tipo: </span>
                  <strong>{{ item.consultationName }}</strong>
                </v-col>
                <v-col cols="12" lg="2">
                  <span>Finalidade: </span>
                  <strong>{{ item.reportPurpose }}</strong>
                </v-col>
                <v-col cols="12" lg="2">
                  <span>Benefício: </span>
                  <strong>{{ item.benefitType }}</strong>
                </v-col>
              </v-row>
            </template>
          </v-list-item>
        </v-list>
      </template>
      <!-- <template #item.dateClose="{ item }">
        {{ item.dateClose ? dayjs(item.dateClose).format("DD/MM/YYYY") : "-" }}
      </template> -->
    </Table>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const userLawyer = useUserLawyerStore();
const $estatistics = computed(() => userLawyer.$estatistics);

const headers = ref([
  // {
  //   title: "Tipo de consulta",
  //   key: "consultationName",
  // },
  {
    title: "",
    key: "patient",
  },
  // {
  //   title: "Data de abertura",
  //   key: "dateOpen",
  // },
  // {
  //   title: "Data de fechamento",
  //   key: "dateClose",
  // },
  // {
  //   title: "Finalidade",
  //   key: "reportPurpose",
  // },
  // {
  //   title: "Tipo de benefício",
  //   key: "benefitType",
  // },
]);
</script>
