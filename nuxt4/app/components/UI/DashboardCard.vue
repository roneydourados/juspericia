<template>
  <CardBlur class="pa-4" @click="$emit('click')" height="100">
    <v-card-text class="d-flex align-center justify-space-between pa-4">
      <span class="text-subtitle-1 text-primary">
        {{ title }}
      </span>
      <div class="d-flex align-center" style="gap: 0.5rem">
        <v-icon :icon="icon" start size="30" :color="iconColor" />
        <span class="text-h5 font-weight-bold text-primary">{{ value }}</span>
      </div>
    </v-card-text>
  </CardBlur>
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
