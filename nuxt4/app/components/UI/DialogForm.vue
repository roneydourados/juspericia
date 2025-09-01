<template>
  <v-dialog
    persistent
    transition="dialog-top-transition"
    :model-value="show"
    :width="mobile ? '' : width"
    :fullscreen="mobile || fullscreen"
  >
    <v-card rounded="xl" :style="`border-top: 6px solid ${borderColor}`">
      <v-toolbar density="default" color="background">
        <v-toolbar-title>
          <span
            class="d-flex align-center text-subtitle-2 text-md-body-2 text-lg-h6 font-weight-bold"
          >
            <slot name="title-preppend" />
            <v-icon v-if="icon" :icon="icon" start />
            <p class="ml-2 text-primary font-weight-bold">
              {{ title }}
            </p>
          </span>
        </v-toolbar-title>
        <v-spacer v-if="!mobile" />
        <v-btn icon @click="$emit('dialog')" variant="text">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
      <v-card flat style="overflow-y: auto">
        <v-card-text>
          <slot />
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  iconColor: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "",
  },
  borderColor: {
    type: String,
    default: "#C7D82F",
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
});
const { mobile } = useDisplay();

defineEmits(["color", "dialog"]);
</script>
