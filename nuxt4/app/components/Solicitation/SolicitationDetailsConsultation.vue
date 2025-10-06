<template>
  <div>
    <div
      class="font-weight-bold mb-4 mt-4 text-primary"
      :style="`${mobile ? 'font-size: 0.8rem' : 'font-size: 1.2rem'}`"
    >
      Dados da consulta
    </div>
    <v-row dense class="text-primary">
      <v-col v-if="$single?.processSituation" cols="12" lg="6">
        <InfoLabel
          title="Situação do processo"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="
            $single?.processSituation
              ? $single?.processSituation === 'PD'
                ? 'Processo distribuido'
                : 'Processo andamento'
              : ''
          "
        />
      </v-col>
      <v-col v-if="$single?.proccessNumber" cols="12" lg="6">
        <InfoLabel
          title="Número do processo"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.proccessNumber"
        />
      </v-col>
      <v-col cols="12">
        <InfoLabel
          title="Email"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.Consultation?.consultationName ?? 'Não informado'"
        />
      </v-col>
    </v-row>
    <v-row
      v-if="$currentUser?.profile?.type === 'ADMIN'"
      dense
      class="text-primary"
    >
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Valor"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="
            amountFormated(
              $single?.valueCredit
                ? Number($single?.valueCredit ?? 0)
                : Number($single?.consultationValue ?? 0),
              true
            )
          "
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Valor antecipação"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="amountFormated($single?.antecipationValue ?? 0, true)"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Total"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="
            amountFormated(
              Number($single?.valueCredit ?? 0) +
                Number($single?.antecipationValue ?? 0),
              true
            )
          "
        />
      </v-col>
    </v-row>
    <v-row dense class="text-primary">
      <v-col cols="12" lg="6">
        <InfoLabel
          title="Tipo benefício"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.BenefitType?.name ?? 'Não informado'"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <InfoLabel
          title="Finalidade"
          :font-size="mobile ? '0.8' : '1'"
          :font-size-content="mobile ? '0.8' : '1'"
          :content="$single?.ReportPurpose?.name ?? 'Não informado'"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();
const { amountFormated } = useUtils();

const storeConsultation = useSolicitationConsultationStore();
const authStore = useAuthStore();

const $currentUser = computed(() => authStore.$currentUser);
const $single = computed(() => storeConsultation.$single);
</script>
