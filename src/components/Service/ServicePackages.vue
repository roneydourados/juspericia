<template>
  <div>
    <v-card flat rounded="lg">
      <v-card-title>
        <HeaderPage title="Pacotes de serviços" />
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col v-for="(item, index) in items" :key="index" cols="12" lg="4">
            <ServicePackageCard
              :title="item.title"
              :value="item.value"
              :category="item.type"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">


const items = ref([
  {
    title: "Pacote completo de serviços com 20 consultas",
    type: "QUERY20",
    value: 1450,
  },
  {
    title: "Pacote completo de serviços com 40 consultas",
    type: "QUERY40",
    value: 3500,
  },
  {
    title: "Pacote completo de serviços com 50 consultas",
    type: "QUERY50",
    value: 4500,
  },
]);


</script>
