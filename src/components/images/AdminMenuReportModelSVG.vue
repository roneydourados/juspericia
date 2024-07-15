<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :height="height"
      viewBox="0 0 24 24"
    >
      <path
        :fill="color"
        d="M8 12h8v-2H8zm0-4h8V6H8zm12 12.55L14.975 14H4V2h16zM4 22v-6h10l4.6 6z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  height: {
    type: String,
    default: "30",
  },
  color: {
    type: String,
    default: "#000",
  },
});
</script>
