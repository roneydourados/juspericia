<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12">
          <v-radio-group
            label="Antecipar em"
            v-model="antecipationValue"
            inline
          >
            <v-radio label="24hrs" :value="data.valueAntecipation24"></v-radio>
            <v-radio label="48hrs" :value="data.valueAntecipation48"></v-radio>
            <v-radio label="72hrs" :value="data.valueAntecipation72"></v-radio>
          </v-radio-group>
          <strong style="font-size: 1.2rem">
            Valor: {{ amountFormated(antecipationValue ?? 0, false) }}
          </strong>
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
  title: {
    type: String,
    default: "",
  },
  data: {
    type: Object as PropType<ConsultationProps>,
    default: {},
  },
  width: {
    type: String,
    default: "500",
  },
});

const { mobile } = useDisplay();
const { amountFormated } = useUtils();

const emit = defineEmits(["close"]);
const show = defineModel<boolean>("show");
const antecipationValue = ref(0);

const submitForm = () => {
  show.value = false;
  emit("close", antecipationValue.value);
  antecipationValue.value = 0;
};

const handleClose = () => {
  show.value = false;
  antecipationValue.value = 0;
  emit("close");
};
</script>
