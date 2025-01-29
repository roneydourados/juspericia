<template>
  <v-card
    rounded="lg"
    prepend-icon="mdi-file-document-outline"
    rel="noopener"
    subtitle="Documento em anxo referente ao laudo"
    target="_blank"
  >
    <template #title>
      <span class="text-info">{{ fileName }}</span>
    </template>
    <template #append>
      <v-btn
        v-if="deleteVisible"
        icon="mdi-delete-outline"
        color="error"
        variant="text"
        @click="emit('delete')"
      />
      <v-btn
        v-if="downloadVisible"
        icon="mdi-cloud-arrow-down-outline"
        color="success"
        variant="text"
        @click="emit('download')"
      />
    </template>
  </v-card>
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
