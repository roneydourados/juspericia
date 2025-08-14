<template>
  <v-dialog
    :model-value="dialog"
    persistent
    max-width="500"
    transition="dialog-top-transition"
  >
    <v-card rounded="lg">
      <v-card-title class="pa-4">
        <InfoLabel
          :title="title"
          :icon="icon"
          :color-icon="color"
          :show-divider="true"
          font-size="1"
        />
      </v-card-title>

      <v-card-text>
        <slot />
      </v-card-text>

      <v-card-actions class="pa-6">
        <v-spacer />
        <Button
          class="text-none"
          variant="outlined"
          size="small"
          v-if="showCancel"
          color="error"
          @click="$emit('cancel')"
        >
          <v-icon icon="mdi-close" />
          <span style="font-size: 0.7rem">
            {{ cancelText }}
          </span>
        </Button>
        <Button
          class="text-none"
          size="small"
          variant="flat"
          color="primary"
          :disabled="okDisabled"
          @click="$emit('confirm')"
        >
          <v-icon icon="mdi-check" color="colorIcon" start />
          <span style="font-size: 0.7rem">
            {{ okText }}
          </span>
        </Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps({
  dialog: { type: Boolean, default: false },
  title: { type: String, default: "" },
  icon: { type: String, default: "mdi-chat-question-outline" },
  color: { type: String, default: "primary" },
  showCancel: { type: Boolean, default: false },
  okText: { type: String, default: "Confirma" },
  cancelText: { type: String, default: "Cancela" },
  okDisabled: { type: Boolean, default: false },
});

defineEmits(["confirm", "cancel"]);
</script>
