<template>
  <v-row dense class="mb-6">
    <v-col cols="12" md="4">
      <CardLeftBorderColor
        title="Total Solicitações"
        color="#5574ED"
        icon="mdi-file-document-multiple"
        icon-color="purple"
        height="200"
      >
        <div class="d-flex flex-column mt-2">
          <span class="text-h4 text-primary font-weight-bold">
            {{ amountFormated(totalSolicitation, true) }}
          </span>
          <span class="text-grey my-6">
            {{ itemCount }}
            {{ itemCount === 1 ? "solicitação" : "solicitações" }}
          </span>
        </div>
      </CardLeftBorderColor>
    </v-col>

    <v-col cols="12" md="4">
      <CardLeftBorderColor
        title="Total Especialidades"
        color="#178DCC"
        icon="mdi-medical-bag"
        icon-color="info"
        height="200"
      >
        <div class="d-flex flex-column mt-2">
          <span class="text-h4 text-info font-weight-bold">
            {{ amountFormated(totalMedicalSpecialty, true) }}
          </span>
          <span class="text-grey my-6"> Honorários médicos </span>
        </div>
      </CardLeftBorderColor>
    </v-col>

    <v-col cols="12" md="4">
      <CardLeftBorderColor
        title="Total Geral"
        color="#10B981"
        icon="mdi-cash-multiple"
        icon-color="success"
        height="200"
      >
        <div class="d-flex flex-column mt-2">
          <span class="text-h4 text-success font-weight-bold">
            {{ amountFormated(totalGeneral, true) }}
          </span>
          <span class="text-grey my-6"> Valor total acumulado </span>
        </div>
      </CardLeftBorderColor>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface ReportItem {
  solicitationValue: number;
  medicalSpecialtyValue: number;
  total: number;
}

const props = defineProps({
  items: {
    type: Array as PropType<ReportItem[]>,
    default: () => [],
  },
});

const { amountFormated } = useUtils();

const totalSolicitation = computed(() => {
  return props.items.reduce((sum, item) => sum + item.solicitationValue, 0);
});

const totalMedicalSpecialty = computed(() => {
  return props.items.reduce((sum, item) => sum + item.medicalSpecialtyValue, 0);
});

const totalGeneral = computed(() => {
  return props.items.reduce((sum, item) => sum + item.total, 0);
});

const itemCount = computed(() => props.items.length);
</script>
