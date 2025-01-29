<template>
  <v-card rounded="lg" flat>
    <v-card-title>
      Relatório de vendas
      <DateInterval v-model="filters.interval" />
    </v-card-title>
    <v-card-text></v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const filters = ref({
  interval: {} as DateInterval,
});
</script>
