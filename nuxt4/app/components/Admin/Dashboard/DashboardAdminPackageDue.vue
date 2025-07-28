<template>
  <DialogForm
    :show="show"
    title="Lista de pacotes a vencer"
    :width="mobile ? '' : width"
    @dialog="$emit('close')"
  >
    <v-card> </v-card>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: "800",
  },
});

const { mobile } = useDisplay();

const emit = defineEmits(["close"]);
</script>
