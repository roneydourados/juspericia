<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    :width="mobile ? '100%' : '70%'"
  >
    <v-card rounded="lg">
      <v-toolbar>
        <v-toolbar-title>
          <div class="text-subtitle-1 font-weight-bold">Detalhes do laudo</div>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="dialog = false" variant="text">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <ZapSignWidget :token="token" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const dialog = defineModel("dialog", {
  default: false,
  type: Boolean,
});

const token = defineModel("token", {
  default: "",
  type: String,
});
</script>
