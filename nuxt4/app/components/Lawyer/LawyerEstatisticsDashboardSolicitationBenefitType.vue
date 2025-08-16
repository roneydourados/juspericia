<template>
  <v-card flat rounded="xl" elevation="6" class="pa-2">
    <Table
      title="Solicitações por tipo de benefício"
      :headers="headers"
      :items="$temTeste"
      :showCrud="false"
    >
      <template v-slot:item.name="{ item }">
        <InfoLabel :title="item.name" :show-divider="false" font-size="1" />
      </template>
      <template v-slot:item.value="{ item }">
        <div class="d-flex align-center">
          <InfoLabel
            :title="item.value.toString()"
            :show-divider="false"
            font-size="1"
          />
          <v-progress-linear
            v-model="item.value"
            :color="item.color"
            height="14"
          ></v-progress-linear>
        </div>
      </template>
    </Table>
  </v-card>
</template>

<script setup lang="ts">
const userLawyer = useUserLawyerStore();
const $estatistics = computed(() => userLawyer.$estatistics);
const { generateRandomColor } = useUtils();

const $temTeste = computed(() => {
  return $estatistics.value?.laywerSolicitationsBenefitType.map((item) => {
    return {
      name: item.benefitType,
      value: item.quantity,
      color: generateRandomColor(),
    };
  });
});

const headers = [
  {
    title: "Tipo de benefício",
    key: "name",
  },
  {
    title: "Qtde",
    key: "value",
  },
];
</script>
