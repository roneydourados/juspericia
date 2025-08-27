<template>
  <v-card flat elevation="0" class="mt-4" color="transparent">
    <v-card-text class="py-12">
      <v-row dense>
        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.initialDate"
            label="Data inicial"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="2">
          <DatePicker
            v-model="filters.finalDate"
            label="Data final"
            clearable
          />
        </v-col>
        <v-col cols="12" lg="4" class="d-flex flex-wrap" style="gap: 0.5rem">
          <SelectInput
            v-model="filters.status"
            label="Status"
            item-title="name"
            item-value="type"
            :items="[
              {
                name: 'Disponível',
                type: 'CONFIRMED',
              },
              {
                name: 'Pendente',
                type: 'PENDING',
              },
              {
                name: 'Expirado',
                type: 'EXPIRED',
              },
              {
                name: 'Finalizado',
                type: 'FINISHED',
              },
            ]"
            @update:model-value="handleFilter"
          />
          <Button
            variant="flat"
            color="primary"
            class="text-none"
            @click="handleFilter"
          >
            <v-icon icon="mdi-filter-outline" start color="colorIcon" />
            <span class="text-caption"> Filtrar </span>
          </Button>
        </v-col>
      </v-row>
    </v-card-text>
    <DialogLoading :dialog="loading" />
  </v-card>
</template>

<script setup lang="ts">
const saltCredit = useUserCreditSaltStore();
const reloadFilters = defineModel({
  default: false,
});
const loading = ref(false);
const filters = ref({
  initialDate: "",
  finalDate: "",
  status: "CONFIRMED",
  isSalt: false,
});

watch(
  () => reloadFilters.value,
  async (newValue) => {
    if (newValue) {
      reloadFilters.value = false;
      await handleFilter();
    }
  }
);

const handleFilter = async () => {
  loading.value = true;
  try {
    await saltCredit.index({
      ...filters.value,
      isSalt: filters.value.status !== "FINISHED",
    });
  } finally {
    loading.value = false;
  }
};
</script>
