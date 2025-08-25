<template>
  <v-card flat>
    <v-card-title>
      <Table
        v-if="!mobile"
        :headers="headers"
        :items="$solicitations"
        title=""
        font-size="1.5rem"
        :show-crud="false"
      >
        <template v-slot:item.dateOpen="{ item }">
          <span class="text-info font-weight-bold">
            {{ dayjs(item.dateOpen).format("DD/MM/YYYY") }}
          </span>
        </template>
        <template v-slot:item.BenefitType.name="{ item }">
          <span class="font-weight-bold">
            {{ item.BenefitType.name }}
          </span>
        </template>
        <template v-slot:item.ReportPurpose.name="{ item }">
          <span class="font-weight-bold">
            {{ item.ReportPurpose.name }}
          </span>
        </template>
        <template v-slot:item.consultationValue="{ item }">
          <span class="font-weight-bold">
            {{ amountFormated(Number(item.consultationValue) ?? 0, false) }}
          </span>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip
            :color="solicitationStatusColor(item.status)"
            text-color="white"
            size="small"
          >
            <span class="text-caption">
              {{ solicitationStatusName(item.status) }}
            </span>
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            color="info"
            variant="text"
            size="small"
            @click="$router.push(`/solicitations/${item.publicId}`)"
          >
            <v-icon
              icon="mdi-file-document-multiple-outline"
              size="20"
            ></v-icon>
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Visualizar solicitação
            </v-tooltip>
          </v-btn>
        </template>
      </Table>
      <PatientSolicitationsTableMobile v-else />
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDisplay } from "vuetify";

const patientStore = usePatientStore();

const { mobile } = useDisplay();
const { amountFormated, solicitationStatusName, solicitationStatusColor } =
  useUtils();

const $solicitations = computed(() => patientStore.$solicitations);

const headers = ref([
  { title: "Data Solicitação", key: "dateOpen" },
  // { title: "Tipo Consulta", key: "Consultation.consultationName" },
  { title: "Tipo Benefício", key: "BenefitType.name" },
  { title: "Finalidade do laudo", key: "ReportPurpose.name" },
  { title: "Valor", key: "consultationValue" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions" },
]);
</script>
