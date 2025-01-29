<template>
  <v-dialog :model-value="dialog" persistent width="auto">
    <v-card rounded="xl" color="primary">
      <div class="d-flex flex-column align-center w-100 pa-8" style="gap: 1rem">
        <AnimedSvg height="80" />
        <Logo height="50" />
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
