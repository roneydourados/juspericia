<template>
  <v-card
    rounded="xl"
    :elevation="elevation"
    width="100%"
    :style="`border-left: 6px solid ${color}`"
    variant="flat"
  >
    <div class="d-flex flex-column pa-4">
      <div class="d-flex align-center justify-space-between">
        <span class="text-primary">{{ title }}</span>
        <v-icon :color="iconColor" size="24" :icon="icon" />
      </div>
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  value: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "mdi-calendar-month",
  },
  iconColor: {
    type: String,
    default: "primary",
  },
  elevation: {
    type: String,
    default: "6",
  },
});
</script>
