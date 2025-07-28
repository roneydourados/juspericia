<template>
  <div class="px-8">
    <vue-json-pretty :data="model" :deep="3" show-length show-line />
  </div>
</template>

<script setup lang="ts">
import { defineModel } from "vue";
// Importe o componente e seu CSS
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const model = defineModel({
  type: Object,
  default: () => ({}),
});
</script>
