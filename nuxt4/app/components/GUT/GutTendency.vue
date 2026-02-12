<template>
  <SelectInput
    v-model="model"
    label="Tendência"
    :items="tendencyOptions"
    item-title="label"
    item-value="value"
    outlined
    dense
  />
</template>

<script setup lang="ts">
const model = defineModel({
  default: 1,
});

const tendencyOptions = [
  { label: "Não piora", value: 1 },
  { label: "Pode piorar", value: 3 },
  { label: "Vai piorar rápido", value: 5 },
];
</script>
