<template>
  <!-- Dialog -->
  <v-dialog v-model="dialogOpen" max-width="500" persistent>
    <v-card class="feedback-card" rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-6 pb-2">
        <div class="d-flex align-center" style="gap: 0.75rem">
          <v-avatar color="primary" size="44">
            <v-icon icon="mdi-message-star-outline" size="24" />
          </v-avatar>
          <div class="d-flex flex-column">
            <span class="text-h6 font-weight-bold">
              Sua opinião é muito importante!
            </span>
            <span class="text-caption text-grey">Ajude-nos a melhorar</span>
            <span class="text-caption text-grey" style="white-space: normal">
              Solicitação nº: {{ nps.patientConsultationId }} Paciente:
              {{ nps.patientConsultation?.Patient?.name }}
              {{ nps.patientConsultation?.Patient?.surname }}
            </span>
          </div>
        </div>
        <v-btn icon variant="text" size="small" @click="closeDialog">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-divider class="mx-6" />

      <FormCrud
        :on-submit="submitFeedback"
        :showSubmitButton="false"
        class="pa-6"
      >
        <!-- Rating -->
        <div class="mb-6">
          <label class="text-body-2 font-weight-medium mb-3 d-block">
            {{ getPhaseDescription(props.nps?.npsPhase ?? 0) }}
          </label>
          <div class="d-flex justify-center" style="gap: 0.5rem">
            <v-rating
              v-model="feedbackModel.rating"
              active-color="orange-darken-1"
              color="grey"
            />
          </div>
        </div>

        <!-- Message -->
        <TextInput
          v-model="feedbackModel.feedback_text"
          label="Conte-nos mais sobre sua experiência"
          placeholder="O que você gostou? O que podemos melhorar?"
          variant="outlined"
          rows="4"
          class="mb-2"
          required
        />

        <!-- Submit -->
        <Button
          block
          variant="outlined"
          color="primary"
          size="large"
          class="text-none mt-2"
          :loading="loading"
          :disabled="!feedbackModel.feedback_text.trim()"
          type="submit"
        >
          <v-icon icon="mdi-send" start />
          <span class="text-colorTextPrimary"> Enviar feedback </span>
        </Button>
      </FormCrud>
      <!-- <pre>{{ nps }}</pre> -->
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  nps: {
    type: Object as PropType<NPSProps>,
    default: () => {},
  },
});

const feedbackStore = useNpsStore();

const dialogOpen = defineModel({
  default: false,
});

const feedbackModel = ref({
  rating: undefined,
  feedback_text: "",
});

const loading = ref(false);

const getPhaseDescription = (phase: number) => {
  switch (phase) {
    case 1:
      return "Como você avalida a experiência e usabilidade da plataforma ?";
    case 2:
      return "Como você avalida a qualidade dos nossos serviços ?";
    case 3:
      return "Para um monitoramento constante de qualidade e usabilidade da plataforma, como você nos avalida ?";
    default:
      return "Como você avalida a experiência e usabilidade da plataforma ?";
  }
};

const submitFeedback = async () => {
  if (
    !feedbackModel.value.feedback_text.trim() ||
    !props.nps ||
    !props.nps.id
  ) {
    return;
  }

  loading.value = true;
  try {
    await feedbackStore.createNps({
      eligibility_id: props.nps.id,
      rating: feedbackModel.value.rating ?? 0,
      feedback_text: feedbackModel.value.feedback_text,
    });
    await feedbackStore.getNpsPending();
    closeDialog();
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  dialogOpen.value = false;
  resetForm();
};

const resetForm = () => {
  feedbackModel.value = {
    rating: undefined,
    feedback_text: "",
  };
};
</script>
