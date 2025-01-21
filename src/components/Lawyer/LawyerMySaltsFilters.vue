<template>
  <v-card flat>
    <v-card-title>
      <strong> Filtros </strong>
    </v-card-title>
    <v-card-text>
      <v-row>
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
        <v-col cols="12" lg="2">
          <SelectInput
            v-model="filters.status"
            label="Status"
            item-title="name"
            item-value="type"
            :items="[
              {
                name: 'Todos',
                type: '',
              },
              {
                name: 'Disponível',
                type: 'CONFIRMED',
              },
              {
                name: 'Pendente',
                type: 'PENDING',
              },
            ]"
          />
        </v-col>
        <v-col cols="12" lg="1">
          <v-btn
            variant="flat"
            color="primary"
            class="text-none"
            size="small"
            @click="handleFilter"
          >
            <v-icon icon="mdi-filter-outline"> </v-icon>
            Filtrar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <DialogLoading :dialog="loading" />
  </v-card>
</template>

<script setup lang="ts">
import moment from "moment";
const saltCredit = useUserCreditSaltStore();
const reloadFilters = defineModel({
  default: false,
});
const loading = ref(false);
const filters = ref({
  initialDate: moment().startOf("month").format("YYYY-MM-DD"),
  finalDate: moment().endOf("month").format("YYYY-MM-DD"),
  status: "",
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
    await saltCredit.index(filters.value);
  } finally {
    loading.value = false;
  }
};
</script>
