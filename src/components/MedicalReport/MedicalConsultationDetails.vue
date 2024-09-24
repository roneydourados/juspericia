<template>
  <div>
    <v-card flat rounded="lg" class="pa-4">
      <v-card flat rounded="lg">
        <v-row dense>
          <v-col cols="12" lg="8">
            <InfoLabel
              title="Paciente"
              font-size="1"
              :content="`${$single?.PatientConsultation?.Patient?.name} ${$single?.PatientConsultation?.Patient?.surname}`"
            />
          </v-col>
          <v-col cols="12" lg="4">
            <InfoLabel
              title="CPF"
              font-size="1"
              :content="
                formatCPFOrCNPJ(
                  $single?.PatientConsultation?.Patient?.cpf ?? ''
                )
              "
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="6">
            <InfoLabel
              title="Tipo de benefício"
              font-size="1"
              :content="$single?.PatientConsultation?.BenefitType?.name"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <InfoLabel
              title="Finalidade do laudo"
              font-size="1"
              :content="$single?.PatientConsultation?.ReportPurpose?.name"
            />
          </v-col>
        </v-row>
      </v-card>
      <v-row dense>
        <v-col cols="12">
          <v-card flat rounded="lg">
            <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
              Descrição dos fatos
            </div>
            <div v-html="$single?.PatientConsultation?.content"></div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const scheduleStore = useScheduleStore();
const { formatCPFOrCNPJ } = useUtils();
const $single = computed(() => scheduleStore.$single);
</script>
