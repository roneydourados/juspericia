<template>
  <div class="d-flex flex-column flex-wrap">
    <span
      class="font-weight-bold text-primary"
      :style="`font-size: ${fontSize}`"
    >
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  fontSize: {
    type: String,
    default: "1rem",
  },
});
</script>
