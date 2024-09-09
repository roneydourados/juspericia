<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title>
        <HeaderPage title="Pacotes de serviços" />
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col v-for="(item, index) in items" :key="index" cols="12" lg="4">
            <ServicePackageCard :title="item.title" :value="item.value" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const items = ref([
  {
    title: "Pacote de consultas",
    value: 100,
  },
  {
    title: "Pacote de exames",
    value: 200,
  },
  {
    title: "Pacote de cirurgias",
    value: 300,
  },
]);
</script>
