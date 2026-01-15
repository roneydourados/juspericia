<template>
  <DialogForm
    title="Nova transação"
    :show="show"
    borderColor="#c8e040"
    fullscreen
    @dialog="show = false"
  >
    <CardBlur class="pa-4" height="100%">
      <div class="d-flex align-center justify-space-between pa-4">
        <span class="text-subtitle-1 text-primary"> Webhook Details </span>
        <div class="d-flex align-center" style="gap: 0.5rem">
          <v-icon icon="mdi-webhook" start size="30" color="orange" />
          <span class="text-h5 font-weight-bold text-primary">Details</span>
        </div>
      </div>
      <v-card-text>
        <JsonViewer
          :value="jsonParsed"
          :expand-depth="3"
          expanded
          copyable
          boxed
          theme="dark"
        />
      </v-card-text>
    </CardBlur>
  </DialogForm>
</template>

<script setup lang="ts">
import { JsonViewer } from "vue3-json-viewer";
const props = defineProps({
  transaction: {
    type: Object as PropType<TransactionProps>,
    default: () => {},
  },
});

const jsonParsed = computed(() => {
  try {
    return JSON.parse(props.transaction.webhookData);
  } catch (e) {
    return {};
  }
});

const show = defineModel({
  default: false,
});
</script>

<style scoped></style>
