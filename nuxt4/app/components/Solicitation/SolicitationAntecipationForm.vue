<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
    border-color="#c8e040"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense class="text-primary">
        <v-col cols="12" class="d-flex justify-center">
          <span style="font-weight: 600">Antecipar em</span>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-radio-group
            v-model="antecipationValue"
            inline
            class="d-flex justify-center"
          >
            <v-radio label="24hrs" :value="data.valueAntecipation24">
              <template #label>
                <strong style="font-size: 1rem">24hs</strong>
              </template>
            </v-radio>
            <v-radio label="48hrs" :value="data.valueAntecipation48">
              <template #label>
                <strong style="font-size: 1rem">48hs</strong>
              </template>
            </v-radio>
            <v-radio label="72hrs" :value="data.valueAntecipation72">
              <template #label>
                <strong style="font-size: 1rem">72hs</strong>
              </template>
            </v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
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
