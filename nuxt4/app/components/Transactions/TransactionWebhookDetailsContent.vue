<template>
  <DialogForm
    title="Detalhes Webhook Transação"
    :show="show"
    borderColor="#c8e040"
    fullscreen
    @dialog="handleClose"
  >
    <JsonViewer
      :value="jsonParsed"
      :expand-depth="3"
      expanded
      copyable
      boxed
      theme="dark"
    />
  </DialogForm>
</template>

<script setup lang="ts">
import { JsonViewer } from "vue3-json-viewer";

const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close"]);

const show = defineModel({
  default: false,
});

const jsonParsed = computed(() => {
  try {
    if (props.content) {
      return JSON.parse(props.content);
    }

    return {};
  } catch (e) {
    return {};
  }
});

const handleClose = () => {
  show.value = false;
  emit("close");
};
</script>
