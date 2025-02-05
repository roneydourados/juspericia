<template>
  <v-card
    rounded="lg"
    prepend-icon="mdi-file-document-outline"
    rel="noopener"
    subtitle="Documento em anxo referente ao laudo"
    target="_blank"
    flat
  >
    <template #title>
      <span class="text-info">{{ fileName }}</span>
    </template>
    <template #append>
      <div class="d-flex" style="gap: 0.5rem">
        <v-btn
          v-if="deleteVisible"
          icon
          color="error"
          variant="tonal"
          @click="emit('delete')"
        >
          <v-icon icon="mdi-delete-outline" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Apagar
          </v-tooltip>
        </v-btn>
        <v-btn
          v-if="downloadVisible"
          icon
          color="info"
          variant="tonal"
          @click="emit('download')"
        >
          <v-icon icon="mdi-cloud-arrow-down-outline" />
          <v-tooltip
            activator="parent"
            location="top center"
            content-class="tooltip-background"
          >
            Download
          </v-tooltip>
        </v-btn>
      </div>
    </template>
  </v-card>
  <v-divider />
</template>

<script setup lang="ts">
defineProps({
  fileName: {
    type: String,
    required: true,
  },
  downloadVisible: {
    type: Boolean,
    default: true,
  },
  deleteVisible: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["delete", "download"]);
</script>

<style scoped></style>
