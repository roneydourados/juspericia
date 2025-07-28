<template>
  <div class="d-flex flex-column flex-wrap">
    <span class="font-weight-bold text-subtitle-1"> {{ title }} </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
