<template>
  <Table
    title="Especialidades médicas"
    font-size="1.5rem"
    :items="$all"
    :headers="headers"
    @search="handleSearch($event)"
    @add="showForm = true"
    :loading="loading"
  >
    <template v-slot:item.medicalSpecialty="{ item }">
      <strong>{{ item.medicalSpecialty }}</strong>
    </template>
    <template v-slot:item.value="{ item }">
      {{ amountFormated(item.value, true) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        color="colorIcon"
        variant="text"
        size="small"
        @click="getItemEdit(item)"
      >
        <v-icon icon="mdi-pencil-outline" size="20"></v-icon>
        <v-tooltip
          activator="parent"
          location="top center"
          content-class="tooltip-background"
        >
          Editar
        </v-tooltip>
      </v-btn>
      <v-btn
        icon
        color="red"
        variant="text"
        size="small"
        @click="getItemDelete(item)"
      >
        <v-icon icon="mdi-delete-outline" size="20"></v-icon>
        <v-tooltip
          activator="parent"
          location="top center"
          content-class="tooltip-background"
        >
          Apagar
        </v-tooltip>
      </v-btn>
    </template>
  </Table>
  <MedicalSpecialtyForm
    v-model:show="showForm"
    :data="selected"
    @close="handleCloseForm"
  />
  <Dialog
    title="CONFIRME"
    :dialog="showDelete"
    @cancel="showDelete = false"
    @confirm="handleDeleteItem"
    show-cancel
  >
    <span>Apagar {{ selected?.medicalSpecialty }} ? </span>
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

const storeMedicalSpecialty = useMedicalSpecialtyStore();
const { amountFormated } = useUtils();
const $all = computed(() => storeMedicalSpecialty.$all?.medicalSpecialtys);

const selected = ref<MedicalSpecialtyProps>();
const loading = ref(false);
const showForm = ref(false);
const showDelete = ref(false);
const headers = ref([
  {
    title: "Especialidade",
    key: "medicalSpecialty",
  },
  {
    title: "Valor",
    key: "value",
  },
  {
    title: "Ações",
    key: "actions",
    width: "10%",
  },
]);

const handleSearch = useDebounceFn(
  async (search: string, isLoading: boolean = true) => {
    loading.value = isLoading;
    try {
      await storeMedicalSpecialty.index(search);
    } finally {
      loading.value = false;
    }
  },
  500
);

const handleCloseForm = () => {
  showForm.value = false;
  selected.value = undefined;
};

const getItemEdit = (item: MedicalSpecialtyProps) => {
  selected.value = item;
  showForm.value = true;
};

const getItemDelete = (item: MedicalSpecialtyProps) => {
  selected.value = item;
  showDelete.value = true;
};

const handleDeleteItem = async () => {
  showDelete.value = false;
  loading.value = true;
  try {
    await storeMedicalSpecialty.destroy(selected.value?.publicId!);
    await handleSearch("", false);
  } finally {
    loading.value = false;
  }
};
</script>
