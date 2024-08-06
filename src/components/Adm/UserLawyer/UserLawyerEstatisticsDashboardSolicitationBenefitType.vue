<template>
  <div>
    <Table
      title="Solicitações por tipo de benefício"
      :headers="headers"
      :items="$temTeste"
      :show-crude="false"
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
  </div>
</template>

<script setup lang="ts">
const bentifTypeStore = useBenefitTypeStore();
const { generateRandomColor } = useUtils();
onMounted(async () => {
  await bentifTypeStore.index("");
});

const $temTeste = computed(() => {
  return bentifTypeStore.$all.map((item) => {
    return {
      name: item.name,
      value: Math.floor(Math.random() * 100),
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
