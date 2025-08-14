<template>
  <div>
    <v-card
      variant="flat"
      rounded="xl"
      :width="width"
      :height="height"
      :elevation="elevation"
      :color="color"
    >
      <v-card-title>
        <slot name="title" />
      </v-card-title>
      <v-card-text>
        <slot name="content" />
      </v-card-text>
      <v-card-actions class="d-flex justify-end pa-4">
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  elevation: {
    type: String,
    default: "0",
  },
  color: {
    type: String,
    default: undefined,
  },
});
</script>

<style scoped></style>
