<template>
  <div class="d-flex align-center rounded-lg px-2 py-1">
    <v-img
      src="@/assets/images/juspericia-logo.svg"
      :height="height"
      :position="position"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  height: {
    type: String,
    default: "40",
  },
  position: {
    type: String,
    default: "left",
  },
});
</script>
