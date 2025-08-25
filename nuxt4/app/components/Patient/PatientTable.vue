<template>
  <Table
    v-if="!mobile"
    :headers="headers"
    :items="$all"
    title="Pacientes"
    font-size="1.5rem"
    @add="showForm = true"
    @search="handleSearch($event)"
    :items-per-page="mobile ? 3 : 6"
    :loading="loading"
  >
    <template v-slot:item.name="{ item }">
      <span
        style="cursor: pointer"
        class="d-flex align-center"
        @click="handlePatientInfo(item.publicId)"
      >
        <v-icon icon="mdi-account-outline" size="24" start color="colorIcon" />
        <div class="d-flex align-center" style="gap: 0.3rem">
          <span>{{ item.name }}</span>
          <span>{{ item.surname }}</span>
        </div>
      </span>
    </template>
    <template v-slot:item.User.name="{ item }">
      <span style="cursor: pointer" class="d-flex align-center">
        <v-icon
          icon="mdi-account-tie-outline"
          size="24"
          start
          color="colorIcon"
        />
        <span>{{ item.User?.name }}</span>
      </span>
    </template>
    <template v-slot:item.cpf="{ item }">
      <span class="d-flex align-center">
        <v-icon
          icon="mdi-clipboard-account-outline"
          size="24"
          color="colorIcon"
          start
        />
        <span>{{ formatCPF(item.cpf) }}</span>
      </span>
    </template>
    <template v-slot:item.phone="{ item }">
      <span class="d-flex align-center">
        <v-icon icon="mdi-whatsapp" size="24" color="colorIcon" start />
        <span>
          {{ formatTelephoneNumber(item.phone ?? "") }}
        </span>
      </span>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon
        color="colorIcon"
        variant="text"
        size="small"
        @click="handleEdit(item)"
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
  <PatientTableMobile
    v-else
    @edit="handleEdit($event)"
    @delete="getItemDelete($event)"
    @info="handlePatientInfo($event)"
  />
  <PatientForm
    :show="showForm"
    title="Dados do Paciente"
    @close="handleCloseForm"
    :data="itemSelected"
    width="800"
  />
  <Dialog
    title="CONFIRME"
    :dialog="showDelete"
    @cancel="showDelete = false"
    @confirm="handleDeleteItem"
    show-cancel
  >
    <span>Apagar {{ itemSelected?.name }} ? </span>
  </Dialog>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { formatCPF } from "@brazilian-utils/brazilian-utils";
import { useDebounceFn } from "@vueuse/core";

const itemStore = usePatientStore();
const auth = useAuthStore();
const $all = computed(() => itemStore.$all);
const $single = computed(() => itemStore.$single);
const headers = computed(() => {
  if (auth.$currentUser?.profile?.type === "ADVOGADO") {
    return [
      { title: "Nome", key: "name" },
      { title: "CPF", key: "cpf" },
      { title: "Whatsapp", key: "phone" },
      { title: "Ações", key: "actions" },
    ];
  }

  return [
    { title: "Nome", key: "name" },
    { title: "CPF", key: "cpf" },
    { title: "Whatsapp", key: "phone" },
    { title: "Advogado", key: "User.name" },
    { title: "Ações", key: "actions" },
  ];
});

const { formatTelephoneNumber } = useUtils();
const { mobile } = useDisplay();
const rounter = useRouter();

const itemSelected = ref<PatientProps>();
const showForm = ref(false);
const showDelete = ref(false);
const loading = ref(false);

const handleSearch = useDebounceFn(
  async (search: string, isLoading: boolean = true) => {
    loading.value = isLoading;
    try {
      await itemStore.index(search);
    } finally {
      loading.value = false;
    }
  },
  500
);

const handleEdit = async (item: PatientProps) => {
  loading.value = true;
  try {
    await itemStore.show(item.publicId!);
    itemSelected.value = $single.value;
    showForm.value = true;
  } finally {
    loading.value = false;
  }
};

const getItemDelete = (item: PatientProps) => {
  itemSelected.value = item;
  showDelete.value = true;
};

const handleDeleteItem = async () => {
  loading.value = true;
  showDelete.value = false;
  try {
    await itemStore.destroy(itemSelected.value!.publicId!);
    await handleSearch("", false);
  } finally {
    loading.value = false;
  }
};

const handleCloseForm = () => {
  showForm.value = false;
  itemSelected.value = undefined;
};

const handlePatientInfo = async (id: string) => {
  await rounter.push(`/patient/${id}`);
};
</script>
