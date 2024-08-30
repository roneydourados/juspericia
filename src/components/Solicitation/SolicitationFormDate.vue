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
          <DatePicker v-model="date" label="Data" placeholder="" required />
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
});

const { mobile } = useDisplay();

const emit = defineEmits(["close"]);
const show = defineModel<boolean>("show");
const date = ref("");

watch(
  () => show.value,
  () => {
    if (show.value) {
      date.value = "";
    }
  },
  { immediate: true }
);

const submitForm = () => {
  handleClose();
};

const handleClose = () => {
  show.value = false;
  emit("close", date.value);
};
</script>
