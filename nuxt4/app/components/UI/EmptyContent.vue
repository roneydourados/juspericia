<template>
  <div class="mx-auto pa-12">
    <v-empty-state :headline="headLine" :title="title" :text="text">
    </v-empty-state>
  </div>
</template>
<script setup lang="ts">
defineProps({
  headLine: {
    type: String,
    default: "Sem dados!",
  },
  title: {
    type: String,
    default: "Oops",
  },
  text: {
    type: String,
    default: "Por enquanto não há nada para mostrar",
  },
});
//const color = ref("rgb(var(--v-theme-primary)) !important");
</script>
