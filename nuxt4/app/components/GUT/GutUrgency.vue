<template>
  <SelectInput
    v-model="model"
    label="Urgência"
    :items="urgencyOptions"
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

const urgencyOptions = [
  { label: "Pode Esperar", value: 1 },
  { label: "Precisa resolver logo", value: 3 },
  { label: "Imediato", value: 5 },
];
</script>
