<template>
  <div class="d-flex flex-column flex-wrap">
    <span
      class="text-colorTextPrimary"
      :style="`font-size: ${fontSize}; font-weight: 600`"
    >
      {{ title }}
    </span>
    <slot />
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
