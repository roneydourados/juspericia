<template>
  <div>
    <Table
      :headers="headers"
      :items="$all"
      title="Pacientes"
      @add="showForm = true"
      @search="handleSearch($event)"
      :items-per-page="mobile ? 3 : 6"
      :loading="loading"
    >
      <template #mobileContent="{ item }: any">
        <v-row dense>
          <v-col cols="12">
            <InfoLabel
              font-size="1"
              font-size-content="1.2"
              title="Nome"
              icon="mdi-account-outline"
              color-icon="info"
              :content="`${item.name} ${item.surname}`"
              :show-divider="true"
              @click="handlePatientInfo(item.publicId)"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <InfoLabel
              title="CPF"
              icon="mdi-clipboard-account-outline"
              color-icon="info"
              font-size="1"
              font-size-content="1.2"
              :content="formatCPF(item.cpf)"
              :show-divider="true"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <InfoLabel
              font-size="1"
              font-size-content="1.2"
              title="Whatsapp"
              icon="mdi-whatsapp"
              color-icon="green"
              :content="formatTelephoneNumber(item.phone ?? '')"
              :show-divider="true"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <InfoLabel
              font-size="1"
              font-size-content="1.2"
              title="Advogado"
              icon="mdi-account-tie-outline"
              color-icon="blue"
              :content="item.User.name"
              :show-divider="true"
            />
          </v-col>
        </v-row>
      </template>
      <template #mobileActions="{ item }">
        <v-btn
          color="orange"
          variant="flat"
          size="small"
          prepend-icon="mdi-pencil-outline"
          @click="handleEdit(item as PatientProps)"
          class="text-none text-white"
        >
          Editar
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          size="small"
          class="text-none text-white"
          prepend-icon="mdi-delete-outline"
          @click="getItemDelete(item as PatientProps)"
        >
          Apagar
        </v-btn>
      </template>
      <template v-slot:item.name="{ item }">
        <span
          style="cursor: pointer"
          class="d-flex align-center text-info"
          @click="handlePatientInfo(item.publicId)"
        >
          <v-icon icon="mdi-account-outline" size="24" start />
          <div class="d-flex align-center" style="gap: 0.3rem">
            <span>{{ item.name }}</span>
            <span>{{ item.surname }}</span>
          </div>
        </span>
      </template>
      <template v-slot:item.User.name="{ item }">
        <span style="cursor: pointer" class="d-flex align-center text-info">
          <v-icon icon="mdi-account-tie-outline" size="24" start />
          <span>{{ item.User.name }}</span>
        </span>
      </template>
      <template v-slot:item.cpf="{ item }">
        <span class="d-flex align-center">
          <v-icon
            icon="mdi-clipboard-account-outline"
            size="24"
            color="info"
            start
          />
          <span>{{ formatCPF(item.cpf) }}</span>
        </span>
      </template>
      <template v-slot:item.phone="{ item }">
        <span class="d-flex align-center">
          <v-icon icon="mdi-whatsapp" size="24" color="green" start />
          <span>
            {{ formatTelephoneNumber(item.phone ?? "") }}
          </span>
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          color="orange"
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
          color="error"
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
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { formatCPF } from "@brazilian-utils/brazilian-utils";

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

const handleSearch = async (search: string, isLoading: boolean = true) => {
  setTimeout(async () => {
    loading.value = isLoading;
    try {
      await itemStore.index(search);
    } finally {
      loading.value = false;
    }
  }, 700);
};

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
