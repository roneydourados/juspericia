<template>
  <div>
    <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
      Dados da consulta
    </div>
    <!-- <v-row v-if="$single?.Schedule && $single?.Schedule.length > 0" dense>
      <v-col cols="12">
        <div class="mb-2 font-weight-bold" style="font-size: 0.9rem">
          Dados agendamento
        </div>
        <div class="d-flex align-center flex-wrap" style="gap: 0.5rem">
          <span> Agendado: </span>
          <strong>
            {{
              dayjs($single?.Schedule?.[0]?.scheduleDate ?? "").format(
                "DD/MM/YYYY"
              )
            }}
            as
            {{ $single?.Schedule?.[0].scheduleHour }}
          </strong>

          Dr(a):
          <strong>
            {{ $single?.Schedule?.[0].Medic?.name }}
          </strong>
        </div>
        <v-divider />
      </v-col>
    </v-row> -->
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
          :content="amountFormated($single?.consultationValue ?? 0, true)"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Valor antecipação"
          font-size="1"
          :content="amountFormated($single?.antecipationValue ?? 0, true)"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <InfoLabel
          title="Total"
          font-size="1"
          :content="
            amountFormated(
              Number($single?.consultationValue ?? 0) +
                Number($single?.antecipationValue ?? 0),
              true
            )
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
import dayjs from "dayjs";
const { amountFormated, formatTelephoneNumber, formatCPFOrCNPJ } = useUtils();
const storeConsultation = useSolicitationConsultationStore();

const $single = computed(() => storeConsultation.$single);
</script>
