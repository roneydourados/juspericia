<template>
  <div v-if="items.length === 0" class="text-center py-8">
    <v-icon icon="mdi-file-document-outline" size="64" color="grey" />
    <p class="text-grey mt-4">Nenhum registro encontrado</p>
  </div>

  <v-row v-else dense>
    <v-col v-for="item in items" :key="item.id" cols="12" lg="6">
      <CardBlur class="report-card" :hover="true">
        <div class="d-flex flex-column" style="gap: 1rem">
          <!-- Header com Status -->
          <div class="d-flex align-center justify-space-between">
            <v-chip
              :color="getStatusColor(item.status)"
              variant="flat"
              size="small"
              class="text-white"
            >
              {{ item.status }}
            </v-chip>
            <span class="text-caption text-grey"> Nº: {{ item.id }} </span>
          </div>

          <!-- Paciente -->
          <div class="d-flex align-start" style="gap: 0.75rem">
            <v-icon icon="mdi-account" color="primary" size="20" />
            <div class="flex-grow-1">
              <span class="text-caption text-grey d-block">Paciente</span>
              <span class="text-body-2 text-darkText font-weight-medium">
                {{ item.patient }}
              </span>
            </div>
          </div>

          <!-- Advogado -->
          <div class="d-flex align-start" style="gap: 0.75rem">
            <v-icon icon="mdi-briefcase" color="primary" size="20" />
            <div class="flex-grow-1">
              <span class="text-caption text-grey d-block">Advogado</span>
              <span class="text-body-2 text-darkText">
                {{ item.lawyer }}
              </span>
            </div>
          </div>

          <!-- Médico -->
          <div class="d-flex align-start" style="gap: 0.75rem">
            <v-icon icon="mdi-stethoscope" color="primary" size="20" />
            <div class="flex-grow-1">
              <span class="text-caption text-grey d-block">Médico</span>
              <span class="text-body-2 text-darkText">
                {{ item.medic }}
              </span>
            </div>
          </div>

          <v-divider />

          <!-- Especialidade e Tipo de Benefício -->
          <div class="d-flex flex-column" style="gap: 0.5rem">
            <div class="d-flex align-center" style="gap: 0.5rem">
              <v-icon icon="mdi-medical-bag" color="info" size="16" />
              <span class="text-caption text-grey">
                {{ item.medicalSpecialty }}
              </span>
            </div>
            <div class="d-flex align-center" style="gap: 0.5rem">
              <v-icon icon="mdi-file-document" color="info" size="16" />
              <span class="text-caption text-grey">
                {{ item.benefitType }}
              </span>
            </div>
            <div class="d-flex align-center" style="gap: 0.5rem">
              <v-icon icon="mdi-scale-balance" color="info" size="16" />
              <span class="text-caption text-grey">
                {{ item.reportPurpose }}
              </span>
            </div>
          </div>

          <v-divider />

          <!-- Valores -->
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex flex-column">
              <span class="text-caption text-grey">Solicitação</span>
              <span class="text-body-2 text-darkText font-weight-medium">
                R$ {{ formatCurrency(item.solicitationValue) }}
              </span>
            </div>
            <div class="d-flex flex-column">
              <span class="text-caption text-grey">Especialidade</span>
              <span class="text-body-2 text-darkText font-weight-medium">
                R$ {{ formatCurrency(item.medicalSpecialtyValue) }}
              </span>
            </div>
            <div class="d-flex flex-column">
              <span class="text-caption text-grey">Total</span>
              <span class="text-h6 text-success font-weight-bold">
                R$ {{ formatCurrency(item.total) }}
              </span>
            </div>
          </div>

          <v-divider />

          <!-- Datas -->
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center" style="gap: 0.5rem">
              <v-icon icon="mdi-calendar-start" color="purple" size="16" />
              <div class="d-flex flex-column">
                <span class="text-caption text-grey">Abertura</span>
                <span class="text-caption text-darkText font-weight-medium">
                  {{ formatDate(item.dateOpen) }}
                </span>
              </div>
            </div>
            <div
              v-if="item.dateClose"
              class="d-flex align-center"
              style="gap: 0.5rem"
            >
              <v-icon icon="mdi-calendar-check" color="purple" size="16" />
              <div class="d-flex flex-column">
                <span class="text-caption text-grey">Fechamento</span>
                <span class="text-caption text-darkText font-weight-medium">
                  {{ formatDate(item.dateClose) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Número do Processo (se houver) -->
          <div
            v-if="item.processNumber"
            class="d-flex align-center"
            style="gap: 0.5rem"
          >
            <v-icon icon="mdi-folder-open" color="wharning" size="16" />
            <span class="text-caption text-darkText">
              Processo: {{ item.processNumber }}
            </span>
          </div>
        </div>
      </CardBlur>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

interface ReportItem {
  id: number;
  publicId: string;
  medic: string;
  lawyer: string;
  patient: string;
  status: string;
  benefitType: string;
  reportPurpose: string;
  processNumber: string | null;
  processSituation: string | null;
  medicalSpecialty: string;
  solicitationValue: number;
  medicalSpecialtyValue: number;
  total: number;
  dateOpen: string;
  dateClose: string | null;
}

defineProps({
  items: {
    type: Array as PropType<ReportItem[]>,
    default: () => [],
  },
});

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    Finalizada: "success",
    Agendada: "info",
    Cancelada: "danger",
    Paga: "purple",
    "Pendente de pagamento": "wharning",
    Aberta: "primary",
  };
  return statusColors[status] || "grey";
};

const formatCurrency = (value: number) => {
  return value.toFixed(2).replace(".", ",");
};

const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY");
};
</script>

<style scoped>
.report-card {
  height: 100%;
  transition: all 0.3s ease;
}

.report-card:hover {
  transform: translateY(-2px);
}
</style>
