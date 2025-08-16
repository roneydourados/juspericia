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

defineProps({
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

const submitForm = () => {
  show.value = false;
  emit("close", motive.value);
};

const handleClose = () => {
  show.value = false;
  emit("close");
};
</script>
