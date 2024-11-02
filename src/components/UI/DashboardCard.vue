<template>
  <div>
    <v-card rounded="lg" flat class="pa-4" :elevation="elevation">
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text class="d-flex align-center justify-end pa-4">
        <v-icon :icon="icon" start size="30" :color="iconColor" />
        <span class="text-h5 font-weight-bold">{{ value }}</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  value: {
    type: String,
    default: "",
  },
  iconColor: {
    type: String,
    default: "orange",
  },
  elevation: {
    type: String,
    default: "0",
  },
});
</script>
