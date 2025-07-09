<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
  ></DialogForm>
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

const show = defineModel({
  default: false,
});
</script>
