<template>
  <div>
    <Table
      :headers="headers"
      :items="$all"
      title="Pacientes"
      @add="showForm = true"
      @search="handleSearch($event)"
      :items-per-page="mobile ? 3 : 6"
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
              :content="item.name"
              :show-divider="true"
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
      </template>
      <template #mobileActions="{ item }">
        <v-btn
          icon
          color="orange"
          variant="text"
          size="small"
          @click="handleEdit(item as PatientProps)"
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
          @click="getItemDelete(item as PatientProps)"
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
      <template v-slot:item.name="{ item }">
        <span style="cursor: pointer" class="d-flex align-center text-info">
          <v-icon icon="mdi-account-outline" size="24" start />
          <span>{{ item.name }}</span>
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
const $all = computed(() => itemStore.$all);
const $single = computed(() => itemStore.$single);

const { formatTelephoneNumber } = useUtils();
const { mobile } = useDisplay();

onMounted(async () => {
  await itemStore.index("");
});

const itemSelected = ref<PatientProps>();
const showForm = ref(false);
const showDelete = ref(false);

const headers = [
  { title: "Nome", key: "name" },
  { title: "CPF", key: "cpf" },
  { title: "Whatsapp", key: "phone" },
  { title: "Ações", key: "actions" },
];

const handleSearch = async (search: string) => {
  await itemStore.index(search);
};

const handleEdit = async (item: PatientProps) => {
  await itemStore.show(item.id!);
  itemSelected.value = $single.value;
  showForm.value = true;
};

const getItemDelete = (item: PatientProps) => {
  itemSelected.value = item;
  showDelete.value = true;
};

const handleDeleteItem = async () => {
  await itemStore.destroy(itemSelected.value!.id!);
  showDelete.value = false;
};

const handleCloseForm = () => {
  showForm.value = false;
  itemSelected.value = undefined;
};
</script>
