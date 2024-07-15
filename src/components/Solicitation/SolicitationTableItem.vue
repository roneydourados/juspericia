<template>
  <v-card flat elevation="8">
    <v-card-title
      class="d-flex align-center pa-6"
      style="gap: 1rem; font-size: 1rem"
    >
      <span class="text-blue font-weight-bold">#{{ solicitation.id }}</span>
      <span class="text-truncate">
        {{ solicitation.title }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" lg="2" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitado:</span>
          <span class="font-weight-bold">{{ solicitation.date }}</span>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <span>Solicitante:</span>
          <span class="font-weight-bold">
            {{ solicitation.solicitante }}
          </span>
        </v-col>
        <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <span>Nº Processo:</span>
          <span class="font-weight-bold">{{ solicitation.processNumber }}</span>
        </v-col>
        <v-col
          cols="12"
          lg="2"
          class="d-flex align-center justify-end"
          style="gap: 0.5rem"
        >
          <span>Status:</span>
          <span class="font-weight-bold">{{ solicitation.status }}</span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="2" class="d-flex align-center" style="gap: 0.5rem">
          <span>Valor:</span>
          <span class="font-weight-bold">{{ solicitation.value }}</span>
        </v-col>
        <v-col cols="12" lg="2" class="d-flex align-center" style="gap: 0.5rem">
          <span>Valor atencipação:</span>
          <span class="font-weight-bold">{{
            solicitation.antecipationValue
          }}</span>
        </v-col>
      </v-row>
      <v-row dense> </v-row>
      <v-row dense>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Paciente:</span>
          <span class="font-weight-bold">{{ solicitation.patient }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="d-flex align-center" style="gap: 0.5rem">
          <span>Médico:</span>
          <span class="font-weight-bold">{{ solicitation.medic }}</span>
          <span>CRM:</span>
          <span class="font-weight-bold">{{ solicitation.crm }}</span>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col
          cols="12"
          lg="10"
          class="d-flex align-center"
          style="gap: 0.5rem"
        >
          <span>Data limite para solicitar correção:</span>
          <span class="font-weight-bold">{{ solicitation.deadline }}</span>
        </v-col>
        <v-col
          cols="12"
          lg="2"
          class="d-flex align-center justify-end"
          style="gap: 0.5rem"
        >
          <span class="text-grey-darken-1">Total:</span>
          <span class="font-weight-bold text-h6 text-grey-darken-3">{{
            solicitation.total
          }}</span>
        </v-col>
      </v-row>
      <v-divider class="mt-2" />
    </v-card-text>
    <v-card-actions>
      <v-row dense align="center">
        <v-col cols="12" lg="3" class="d-flex align-center px-4">
          <v-btn
            v-if="rating === 0"
            class="text-none font-weight-bold"
            prepend-icon="mdi-star"
            color="orange-darken-1"
            @click="rating = 1"
          >
            Avaliar solicitação
          </v-btn>
          <div v-if="rating > 0" class="text-center">
            <v-rating
              v-model="rating"
              active-color="orange-darken-1"
              color="orange-lighten-1"
            ></v-rating>
          </div>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-file-document-refresh-outline"
            color="indigo"
          >
            Solicitar correção
          </v-btn>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-calendar-clock-outline"
            color="success"
          >
            Solicitar antecipação
          </v-btn>
        </v-col>
        <v-col cols="12" lg="2">
          <v-btn
            class="text-none font-weight-bold"
            prepend-icon="mdi-dots-vertical"
            color="pink"
            @click="handleDetailsClick(1)"
          >
            Visualizar detalhes
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  solicitation: {
    type: Object,
    default: () => {},
  },
});

const rounter = useRouter();
const rating = ref(0);

const handleDetailsClick = async (id: number) => {
  await rounter.push(`/solicitations/${id}`);
};
</script>
