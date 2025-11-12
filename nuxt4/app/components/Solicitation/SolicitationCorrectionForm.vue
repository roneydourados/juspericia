<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
    border-color="#c8e040"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12">
          <TextInput
            v-model="motive"
            label="Motivo correção"
            placeholder="Descreva motivo"
            rows="8"
            required
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500",
  },
  patientConsultation: {
    type: Object as PropType<SolicitationConsultationProps>,
    required: true,
  },
});

const { mobile } = useDisplay();
const storeConsultation = useSolicitationConsultationStore();
const emit = defineEmits(["close"]);
const show = defineModel("show", {
  default: false,
});
const motive = ref("");

watch(
  show,
  (val) => {
    if (!val) {
      motive.value = "";
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  try {
    await storeConsultation.createSolicitationCorrection({
      patientConsultationId: props.patientConsultation.id!,
      correctionReason: motive.value,
    });

    show.value = false;

    emit("close", motive.value);
  } catch (error) {
    console.log(`Erro ao tentar criar uma correção de solicitação: ${error}`);
  }
};

const handleClose = () => {
  show.value = false;
  emit("close");
};
</script>
