<template>
  <v-card flat rounded="lg" class="pa-4">
    <v-card-title>
      <v-row dense>
        <v-col cols="12" lg="11">
          <span style="font-size: 1.5rem">Detalhes</span>
        </v-col>
        <v-col cols="12" lg="1">
          <v-btn
            class="text-none"
            prepend-icon="mdi-arrow-left"
            flat
            color="primary"
            size="small"
            @click="router.back()"
          >
            Voltar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-row dense class="px-4">
      <v-divider />
      <v-col cols="12" lg="6">
        <v-card flat rounded="lg">
          <div
            v-if="$single?.Schedule && $single?.Schedule.length > 0"
            class="d-flex bg-green-darken-1 pa-2 rounded-lg"
          >
            <InfoLabel
              title="Teleconsulta agendada para"
              font-size="1.1"
              font-size-content="1.1"
              :content="`${moment($single.Schedule[0]?.scheduleDate).format(
                'DD/MM/YYYY'
              )} as ${$single.Schedule[0].scheduleHour}`"
            />
          </div>
          <SolicitationDetailsConsultation />
          <SolicitationDetailsPatient />
          <SolicitationDetailsOffice />
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card flat rounded="lg">
          <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
            Descrição dos fatos
          </div>
          <div v-html="$single?.content" />
        </v-card>
        <SolicitationDetailsDocuments />
        <v-card flat rounded="lg">
          <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
            Motivo para correção
          </div>
          <div v-html="$single?.reasonCorrection" />
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="$single?.PatientConsultationReport" dense class="px-4 mt-9">
      <v-col cols="12">
        <v-card flat rounded="lg">
          <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
            Laudo médico
          </div>

          <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
            Descrição de laudo médico
          </div>
          <div v-html="$single?.PatientConsultationReport?.content" />
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import moment from "moment";
const router = useRouter();
const storeConsultation = useSolicitationConsultationStore();
const $single = computed(() => storeConsultation.$single);
</script>
