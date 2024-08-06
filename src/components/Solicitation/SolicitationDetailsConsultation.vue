<template>
  <div>
    <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
      Dados da consulta
    </div>
    <v-row dense>
      <v-col cols="12">
        <InfoLabel
          title="Email"
          font-size="1"
          :content="$single?.Consultation?.consultationName ?? 'Não informado'"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Valor"
          font-size="1"
          :content="amountFormated($single?.Consultation?.value ?? 0, true)"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Valor antecipação"
          font-size="1"
          :content="
            amountFormated($single?.Consultation?.valueAntecipation ?? 0, true)
          "
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Valor créd."
          font-size="1"
          :content="
            amountFormated($single?.Consultation?.valueCredit ?? 0, true)
          "
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="6">
        <InfoLabel
          title="Tipo benefício"
          font-size="1"
          :content="$single?.BenefitType?.name ?? 'Não informado'"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <InfoLabel
          title="Finalidade"
          font-size="1"
          :content="$single?.ReportPurpose?.name ?? 'Não informado'"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { amountFormated, formatTelephoneNumber, formatCPFOrCNPJ } = useUtils();
const storeConsultation = useSolicitationConsultationStore();

const $single = computed(() => storeConsultation.$single);
</script>
