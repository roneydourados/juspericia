<template>
  <Card>
    <template #content>
      <Table
        title="Horas trabalhadas dos médicos"
        :headers="headers"
        :items="$dash?.medicAtendimentHours"
        :showCrud="false"
      />
    </template>
  </Card>
</template>

<script setup lang="ts">
const dash = useUserAdminStore();
const $dash = computed(
  () => dash.$dashboard ?? ({} as SalesAdminDashboardProps)
);
const headers = [
  {
    title: "Médico",
    key: "medic",
  },
  {
    title: "Duração",
    key: "duration",
  },
];
</script>
