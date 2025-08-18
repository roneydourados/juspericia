<template>
  <CardBlur height="100%">
    <template #content>
      <Table
        title="Revisão de laudo médico"
        :headers="headers"
        :items="$medics"
        :showCrud="false"
      >
        <template v-slot:item.name="{ item }">
          <span>{{ item.name }}</span>
        </template>
        <template v-slot:item.value="{ item }">
          <div class="d-flex align-center">
            <span>{{ item.value }}</span>
            <v-progress-linear
              v-model="item.value"
              :color="item.color"
              height="14"
            />
          </div>
        </template>
      </Table>
    </template>
  </CardBlur>
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
    title: "Revisões",
    key: "value",
  },
];
</script>
