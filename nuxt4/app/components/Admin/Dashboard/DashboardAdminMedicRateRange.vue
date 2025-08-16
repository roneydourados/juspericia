<template>
  <Card>
    <template #content>
      <Table
        title="Aviliações dos médicos"
        :headers="headers"
        :items="$dash?.medicRate"
        :showCrud="false"
      />
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
