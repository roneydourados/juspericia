<template>
  <div v-if="show">
    <div class="d-flex justify-center w-100 mt-8">
      <v-progress-circular indeterminate :color="color" :size="size" />
    </div>
    <div class="d-flex justify-center w-100 mt-8">
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "Aguarde...",
  },
  color: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "70",
  },
});
</script>
