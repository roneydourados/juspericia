<template>
  <v-dialog
    persistent
    transition="dialog-top-transition"
    :model-value="show"
    :width="mobile ? '' : width"
  >
    <v-card rounded="lg">
      <v-toolbar density="default" color="background">
        <v-toolbar-title>
          <span
            class="d-flex align-center text-subtitle-2 text-md-body-2 text-lg-h6 font-weight-bold"
          >
            <slot name="title-preppend" />
            <p class="ml-2">
              {{ title }}
            </p>
          </span>
        </v-toolbar-title>
        <v-spacer />
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
});
const { mobile } = useDisplay();

defineEmits(["color", "dialog"]);
</script>
