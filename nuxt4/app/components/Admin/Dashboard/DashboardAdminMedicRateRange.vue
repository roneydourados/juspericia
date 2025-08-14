<template>
  <Card>
    <template #content>
      <Table
        title="Aviliações dos médicos"
        :headers="headers"
        :items="$dash?.medicRate"
        :showCrud="false"
      >
        <template v-slot:item.medic="{ item }">
          <InfoLabel
            :content="item.medic"
            :show-divider="false"
            font-size="0.8"
          />
        </template>
        <template v-slot:item.rate="{ item }">
          <div class="d-flex align-center">
            <InfoLabel
              :content="item.rate.toString()"
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
