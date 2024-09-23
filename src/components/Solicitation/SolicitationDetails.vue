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
          <div v-html="$single?.content"></div>
        </v-card>
        <v-card flat rounded="lg">
          <div class="font-weight-bold mb-4 mt-4" style="font-size: 1.2rem">
            Motivo para correção
          </div>
          <div v-html="$single?.reasonCorrection"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <!-- <pre>{{ $single }}</pre> -->
</template>

<script setup lang="ts">
const router = useRouter();
const storeConsultation = useSolicitationConsultationStore();
const $single = computed(() => storeConsultation.$single);
</script>
