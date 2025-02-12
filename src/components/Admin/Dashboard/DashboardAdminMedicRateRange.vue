<template>
  <Card elevation="4">
    <template #title>
      <span> Aviliações dos médicos </span>
    </template>
    <template #content>
      <Table
        title=""
        :headers="headers"
        :items="$dash?.medicRate"
        :showCrud="false"
      >
        <template v-slot:item.medic="{ item }">
          <InfoLabel :title="item.medic" :show-divider="false" font-size="1" />
        </template>
        <template v-slot:item.rate="{ item }">
          <div class="d-flex align-center">
            <InfoLabel
              :title="item.rate.toString()"
              :show-divider="false"
              font-size="1"
            />
            <v-progress-linear
              v-model="item.rate"
              :color="item.color"
              height="14"
            />
          </div>
        </template>
      </Table>
    </template>
  </Card>
</template>

<script setup lang="ts">
const dash = useUserAdminStore();
const $dash = computed(() => dash.$dashboard);

const headers = [
  {
    title: "Médico",
    key: "medic",
  },
  {
    title: "Aviliações",
    key: "rate",
  },
];
</script>
