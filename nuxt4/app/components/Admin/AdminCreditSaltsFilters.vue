<template>
  <v-card flat>
    <v-card-text>
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
        <v-col cols="12" lg="4">
          <SelectSearchLawyer
            v-model="filters.lawyer"
            @update:model-value="handleFilter"
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
        </v-col>
      </v-row>
    </v-card-text>
    <DialogLoading :dialog="loading" />
  </v-card>
</template>

<script setup lang="ts">
const saltCredit = useUserCreditSaltStore();

const loading = ref(false);
const filters = defineModel({
  default: {
    initialDate: "",
    finalDate: "",
    status: "CONFIRMED",
    lawyer: undefined as UserProps | undefined,
    isSalt: true,
    publicIdExclude: undefined as string | undefined,
  },
});

const handleFilter = async () => {
  loading.value = true;
  try {
    await saltCredit.indexAdmin({
      initialDate: filters.value.initialDate,
      finalDate: filters.value.finalDate,
      status: filters.value.status,
      userId: filters.value.lawyer?.id,
      isSalt: filters.value.isSalt,
    });
  } finally {
    loading.value = false;
  }
};
</script>
