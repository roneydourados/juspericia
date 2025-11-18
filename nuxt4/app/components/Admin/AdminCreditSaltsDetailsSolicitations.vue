<template>
  <CardBlur height="100%">
    <v-row dense justify="center">
      <v-col
        v-for="(item, index) in $estatisticsByAdmin?.laywerSolicitationsStatus"
        cols="12"
        lg="4"
        :key="index"
      >
        <DashboardCard
          :title="item.status"
          icon="mdi-file-clock-outline"
          :value="item.quantity.toString()"
          icon-color="primary"
          elevation="6"
        />
      </v-col>
    </v-row>
    <Table
      title="Solicitações"
      :headers="headers"
      :items="$estatisticsByAdmin?.laywerSolicitations"
      :items-per-page="10"
      :showCrud="false"
    >
      <template #item.patient="{ item }">
        <v-list density="compact">
          <v-list-item>
            <template v-slot:title>
              <v-row dense>
                <v-col
                  cols="12"
                  lg="8"
                  class="d-flex align-center"
                  style="gap: 0.5rem"
                >
                  <span>
                    Solicitação:
                    <strong>{{ item.id }}</strong>
                  </span>

                  <span>
                    Paciente:
                    <strong>{{ item.patient }}</strong>
                  </span>
                </v-col>
                <v-col
                  cols="12"
                  lg="4"
                  class="d-flex align-center justify-end"
                  style="gap: 0.5rem"
                >
                  <span> Vlr Solicitação: </span>
                  <strong>
                    {{ amountFormated(Number(item.valueCredit) ?? 0, true) }}
                  </strong>
                  <span> Vlr Especiliade: </span>
                  <strong>
                    {{
                      amountFormated(
                        Number(item.medicalSpecialtyValue) ?? 0,
                        true
                      )
                    }}
                  </strong>
                  <span> Total: </span>
                  <strong>
                    {{ amountFormated(Number(item.total) ?? 0, true) }}
                  </strong>
                </v-col>
              </v-row>
            </template>
            <template v-slot:subtitle>
              <v-row dense align="center" class="mt-2">
                <v-col cols="12" lg="2">
                  <v-chip
                    :color="solicitationStatusColor(item.status)"
                    variant="flat"
                  >
                    {{ item.statusName }}
                  </v-chip>
                </v-col>
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
                <v-col cols="12" lg="2">
                  <span>Data Abertura: </span>
                  <strong>
                    {{
                      item.dateOpen
                        ? dayjs(item.dateOpen).format("DD/MM/YYYY")
                        : "-"
                    }}
                  </strong>
                </v-col>
                <v-col cols="12" lg="2">
                  <span>Data Finalização: </span>
                  <strong>
                    {{
                      item.dateClose
                        ? dayjs(item.dateClose).format("DD/MM/YYYY")
                        : "-"
                    }}
                  </strong>
                </v-col>
              </v-row>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </Table>
  </CardBlur>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
const userLawyer = useUserLawyerStore();
const { amountFormated, solicitationStatusColor } = useUtils();
const $estatisticsByAdmin = computed(() => userLawyer.$estatisticsByAdmin);

const headers = ref([
  {
    title: "",
    key: "patient",
  },
]);
</script>
