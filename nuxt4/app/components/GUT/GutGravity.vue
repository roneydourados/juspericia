<template>
  <SelectInput
    v-model="model"
    label="Gravidade"
    :items="gravityOptions"
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

const gravityOptions = [
  { label: "Sem Impacto", value: 1 },
  { label: "Impacto Moderado", value: 3 },
  { label: "Impacto Crítico", value: 5 },
];
</script>
