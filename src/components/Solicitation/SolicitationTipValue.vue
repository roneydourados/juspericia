<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12" lg="6">
          <CurrencyInput
            v-model:model-number="value.value"
            v-model:model-value="value.text"
            label="Valor gorjeta"
            placeholder=""
            required
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import CurrencyInput from "../UI/inputs/CurrencyInput.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500",
  },
});

const { mobile } = useDisplay();

const emit = defineEmits(["close"]);
const show = defineModel<boolean>("show");
const value = ref({
  text: "0,00",
  value: 0,
});

watch(
  () => show.value,
  () => {
    if (show.value) {
      value.value = {
        text: "0,00",
        value: 0,
      };
    }
  },
  { immediate: true }
);

const submitForm = () => {
  handleClose();
};

const handleClose = () => {
  show.value = false;
  emit("close", value.value.value);
};
</script>
