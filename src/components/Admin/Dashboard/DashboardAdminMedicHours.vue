<template>
  <Card elevation="4">
    <template #title>
      <span> Horas trabalhadas dos médicos </span>
    </template>
    <template #content>
      <Table title="" :headers="headers" :items="$medics" :showCrud="false">
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
    </template>
  </Card>
</template>

<script setup lang="ts">
const bentifTypeStore = useBenefitTypeStore();
const medicStore = useMedicStore();
const { generateRandomColor } = useUtils();
onMounted(async () => {
  await bentifTypeStore.index("");
});

const $medics = computed(() => {
  return medicStore.$all
    .map((item) => ({
      name: `Dr(a) ${item.name}`,
      value: Math.floor(Math.random() * 100),
      color: generateRandomColor(),
    }))
    .sort((a, b) => b.value - a.value);
});

const headers = [
  {
    title: "Médico",
    key: "name",
  },
  {
    title: "Horas",
    key: "value",
  },
];
</script>
