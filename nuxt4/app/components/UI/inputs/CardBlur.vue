<template>
  <v-card class="custom-card" rounded="xl" :height="height" width="100%">
    <slot />
    <v-card-title>
      <slot name="title" />
    </v-card-title>
    <v-card-text>
      <slot name="content" />
    </v-card-text>
    <v-card-actions>
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  height: {
    type: String,
    default: undefined,
  },
});
</script>

<style scoped>
.custom-card {
  width: 280px;
  padding: 2rem 1rem;

  /* sombra com blur */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(6px);

  transition: all 0.3s ease;
}
.custom-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}
</style>
