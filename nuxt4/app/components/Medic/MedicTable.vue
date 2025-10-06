<template>
  <Table
    v-if="!mobile"
    title="Médicos parceiros"
    font-size="1.5rem"
    :items="$all"
    :headers="headers"
    @search="handleSearch($event)"
    @add="showForm = true"
    :loading="loading"
    :mobile="mobile"
  >
    <template v-slot:item.name="{ item }">
      <span
        style="cursor: pointer"
        class="d-flex align-center text-info"
        @click="getItemEdit(item)"
      >
        <v-icon icon="mdi-account-outline" size="24" start color="colorIcon" />
        <span>{{ item.name }}</span>
      </span>
      <div
        v-for="medicalSpecialty in item.medicalSpecialtiesMedic"
        class="d-flex flex-column"
      >
        <span class="text-caption">
          {{ medicalSpecialty.medicalSpecialty.medicalSpecialty }}
        </span>
      </div>
    </template>

    <template v-slot:item.email="{ item }">
      <span class="d-flex align-center">
        <v-icon icon="mdi-email-outline" size="24" color="colorIcon" start />
        <span>
          {{ item.email }}
        </span>
      </span>
    </template>
    <template v-slot:item.active="{ item }">
      <span class="d-flex align-center">
        <v-icon
          :icon="item.active ? 'mdi-check-circle' : 'mdi-cancel'"
          size="24"
          :color="item.active ? 'colorIcon' : 'red'"
          start
        />
      </span>
    </template>
    <template v-slot:item.medicalSpecialty="{ item }"> </template>
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
      <v-btn
        v-if="!item.nuvidioDepartmentId"
        icon
        color="blue"
        variant="text"
        size="small"
        @click="createNuvidioAttendent(item)"
      >
        <v-icon icon="mdi-headphones" size="20"></v-icon>
        <v-tooltip
          activator="parent"
          location="top center"
          content-class="tooltip-background"
        >
          Criar atendente para atendimento teleconferência
        </v-tooltip>
      </v-btn>
    </template>
  </Table>
  <MedicTableMobile
    v-else
    @edit="getItemEdit($event)"
    @delete="getItemDelete($event)"
  />

  <MedicForm
    width="800"
    title="Médico"
    :show="showForm"
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
    <span>Apagar {{ selected?.name }} ? </span>
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { useDisplay } from "vuetify";
const medicStore = useMedicStore();
const nuvidioStore = useNuvidioStore();

//const { formatTelephoneNumber } = useUtils();
const { mobile } = useDisplay();
const $all = computed(() => medicStore.$all);

const selected = ref<UserProps>();
const loading = ref(false);
const showForm = ref(false);
const showDelete = ref(false);
const headers = ref([
  {
    title: "Nome",
    key: "name",
  },
  // {
  //   title: "Telefone",
  //   key: "phone",
  // },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Ativo",
    key: "active",
  },
  // {
  //   title: "Especialidade",
  //   key: "medicalSpecialty",
  // },
  {
    title: "Ações",
    key: "actions",
    width: "15%",
  },
]);

const handleSearch = useDebounceFn(
  async (search: string, isLoading: boolean = true) => {
    loading.value = isLoading;
    try {
      await medicStore.index(search);
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

const getItemEdit = (item: UserProps) => {
  selected.value = item;
  showForm.value = true;
};

const getItemDelete = (item: UserProps) => {
  selected.value = item;
  showDelete.value = true;
};

const handleDeleteItem = async () => {
  showDelete.value = false;
  loading.value = true;
  try {
    await medicStore.destroy(selected.value?.publicId!);
    await handleSearch("", false);
  } finally {
    loading.value = false;
  }
};

const createNuvidioAttendent = async (item: UserProps) => {
  push.info({
    title: "Criar atendente teleconsulta",
    message: `Confirma criar atendente para ${item.name} ?`,
    duration: Infinity, // Não fecha automaticamente
    props: {
      isModal: true, // Propriedade customizada para identificar como modal
      preventOverlayClose: true, // Impede fechar clicando no overlay
      preventEscapeClose: false, // Permite fechar com ESC
      actions: [
        {
          label: "Criar",
          variant: "primary",
          icon: "mdi-file-rotate-right-outline",
          iconColor: "colorIcon",
          handler: async () => {
            loading.value = true;
            try {
              await nuvidioStore.createAttendantDepartment(item.publicId!);
              await handleSearch("", false);
            } catch (error) {
              push.error("Erro ao apagar horário");
            } finally {
              loading.value = false;
            }
          },
        },
        {
          label: "Cancelar",
          variant: "secondary",
          icon: "mdi-close",
          iconColor: "red",
          handler: () => {},
        },
      ],
    },
  });
};
</script>
