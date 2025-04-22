<template>
  <v-dialog :model-value="dialog" persistent width="auto">
    <v-card rounded="xl" color="primary" min-width="200">
      <div class="d-flex flex-column align-center w-100 pa-8" style="gap: 1rem">
        <AnimedSvg height="80" />
        <span style="font-weight: 700; font-size: 1.2rem">Aguarde...</span>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
});
</script>
