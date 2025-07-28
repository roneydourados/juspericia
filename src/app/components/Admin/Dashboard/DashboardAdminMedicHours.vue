<template>
  <Card elevation="4">
    <template #title>
      <span> Horas trabalhadas dos médicos </span>
    </template>
    <template #content>
      <Table
        title=""
        :headers="headers"
        :items="$dash?.medicAtendimentHours"
        :showCrud="false"
      >
        <template v-slot:item.medic="{ item }">
          <InfoLabel
            :content="item.medic"
            :show-divider="false"
            font-size="1"
          />
        </template>
        <template v-slot:item.duration="{ item }">
          <div class="d-flex align-center">
            <InfoLabel
              :content="`${item.duration?.toString()}hrs`"
              :show-divider="false"
              font-size="1"
            />
          </div>
        </template>
      </Table>
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
