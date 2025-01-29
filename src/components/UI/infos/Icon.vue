<template>
  <v-avatar :color="color">
    <v-icon :icon="icon" :size="size" :color="colorIcon" />
  </v-avatar>
</template>

<script setup lang="ts">
defineProps({
  color: { type: String, default: "" },
  icon: { type: String, default: "" },
  size: { type: String, default: "26" },
  colorIcon: { type: String, default: "white" },
});
</script>
