<template>
  <v-card>
    <v-navigation-drawer
      v-model="drawer"
      draw
      temporary
      location="right"
      width="400"
    >
      <v-card flat>
        <v-card-title class="d-flex align-center" style="gap: 0.5rem">
          <v-btn
            variant="flat"
            color="info"
            class="text-none"
            size="small"
            @click="drawer = false"
          >
            <v-icon icon="mdi-arrow-left"> </v-icon>
            Voltar
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="text-none"
            size="small"
            @click="filter"
          >
            <v-icon icon="mdi-filter-outline"> </v-icon>
            Filtrar
          </v-btn>
        </v-card-title>
        <v-card-text class="py-8">
          <v-row dense>
            <v-col cols="12">
              <SelectSearchPatient v-model="modelFilters.patient" clearable />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <SelectSearchBenefitType
                v-model="modelFilters.benefitType"
                clearable
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <SelectSearchReportPurpose
                v-model="modelFilters.reportPurpose"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>

<script setup lang="ts">
const { setSolicitationsFilters } = useUtils();
const emit = defineEmits(["update:modelValue"]);
const modelFilters = defineModel<SolicitationConsultationFilterProps>(
  "filters",
  {
    type: Object as PropType<SolicitationConsultationFilterProps>,
    default: () => ({}),
  }
);

const drawer = defineModel<boolean>("drawer");

const filter = () => {
  setSolicitationsFilters(modelFilters.value);
  emit("update:modelValue", modelFilters.value);
  drawer.value = !drawer.value;
};
</script>
