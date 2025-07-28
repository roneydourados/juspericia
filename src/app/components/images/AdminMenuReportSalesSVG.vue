<template>
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :height="height"
      viewBox="0 0 32 32"
    >
      <path :fill="color" d="M15 20h2v4h-2zm5-2h2v6h-2zm-10-4h2v10h-2z" />
      <path
        :fill="color"
        d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z"
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
