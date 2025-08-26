<template>
  <v-dialog
    :model-value="dialog"
    persistent
    :max-width="mobile ? '' : '500'"
    transition="dialog-top-transition"
    width="100%"
    :fullscreen="fullscreen"
  >
    <v-card
      rounded="xl"
      :style="`border-top: 6px solid ${borderColor}`"
      :class="mobile ? 'px-0' : 'px-4'"
    >
      <v-card-title class="pa-4">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon :icon="icon" color="amber" size="24" start />
            <strong class="text-primary">{{ title }}</strong>
          </div>
          <v-btn color="primary" icon variant="text" @click="$emit('cancel')">
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>

        <v-divider class="mt-8" />
      </v-card-title>

      <v-card-text class="text-primary">
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
          <span style="font-size: 0.7rem; font-weight: 500">
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
          <span style="font-size: 0.7rem; font-weight: 500">
            {{ okText }}
          </span>
        </Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
defineProps({
  dialog: { type: Boolean, default: false },
  title: { type: String, default: "" },
  icon: { type: String, default: "mdi-chat-question-outline" },
  color: { type: String, default: "primary" },
  showCancel: { type: Boolean, default: false },
  okText: { type: String, default: "Confirma" },
  cancelText: { type: String, default: "Cancela" },
  okDisabled: { type: Boolean, default: false },
  borderColor: { type: String, default: "#F6BF0C" },
  fullscreen: { type: Boolean, default: false },
});

const { mobile } = useDisplay();

defineEmits(["confirm", "cancel"]);
</script>
