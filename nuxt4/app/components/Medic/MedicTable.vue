<template>
  <Table
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

      <div class="d-flex flex-wrap" style="gap: 0.5rem">
        <div>Atendimento:</div>
        <div v-if="item.seg" class="font-weight-bold">Seg</div>
        <div v-if="item.ter" class="font-weight-bold">Ter</div>
        <div v-if="item.qua" class="font-weight-bold">Qua</div>
        <div v-if="item.qui" class="font-weight-bold">Qui</div>
        <div v-if="item.sex" class="font-weight-bold">Sex</div>
        <div v-if="item.sab" class="font-weight-bold">Sab</div>
        <div v-if="item.dom" class="font-weight-bold">Dom</div>
        <div>Das: {{ item.medicHourStart }} até {{ item.medicHourEnd }}</div>
      </div>
    </template>
    <template v-slot:item.phone="{ item }">
      <span class="d-flex align-center">
        <v-icon icon="mdi-whatsapp" size="24" color="colorIcon" start />
        <span>
          {{ item.phone ? formatTelephoneNumber(item.phone) : "Não informado" }}
        </span>
      </span>
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
    <template v-slot:item.medicalSpecialty="{ item }">
      <v-icon icon="mdi-medical-bag" start color="colorIcon" />
      <strong>
        {{
          item.medicalSpecialty
            ? item.medicalSpecialty.medicalSpecialty
            : "Não  informado"
        }}
      </strong>
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
    <template #mobileActions="{ item }">
      <v-btn
        color="orange"
        variant="flat"
        size="small"
        prepend-icon="mdi-pencil-outline"
        @click="getItemEdit(item as UserProps)"
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
        @click="getItemDelete(item as UserProps)"
      >
        Apagar
      </v-btn>
    </template>
    <template #mobileContent="{ item }: any">
      <v-row dense>
        <v-col cols="12">
          <InfoLabel
            font-size="1"
            font-size-content="1.2"
            title="Nome"
            icon="mdi-account-outline"
            color-icon="info"
            :content="`${item.name} ${item.name}`"
            :show-divider="true"
          />
        </v-col>
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
        <v-col cols="12">
          <InfoLabel
            font-size="1"
            font-size-content="1.2"
            title="E-mail"
            icon="mdi-email-outline"
            color-icon="warning"
            :content="item.email"
            :show-divider="true"
          />
        </v-col>
        <v-col cols="12">
          <InfoLabel
            font-size="1"
            font-size-content="1.2"
            title="Status"
            :icon="item.active ? 'mdi-check-circle' : 'mdi-cancel'"
            :color-icon="item.active ? 'green' : 'error'"
            :content="item.active ? 'Ativo' : 'Inativo'"
            :show-divider="true"
          />
        </v-col>
        <v-col cols="12">
          <InfoLabel
            font-size="1"
            font-size-content="1.2"
            title="Especialidade"
            icon="mdi-medical-bag"
            :color-icon="item.active ? 'green' : 'error'"
            :content="
              item.medicalSpecialty
                ? item.medicalSpecialty.medicalSpecialty
                : 'Não informado'
            "
            :show-divider="true"
          />
        </v-col>
      </v-row>
    </template>
  </Table>

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

const { formatTelephoneNumber } = useUtils();
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
  {
    title: "Telefone",
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Ativo",
    key: "active",
  },
  {
    title: "Especialidade",
    key: "medicalSpecialty",
  },
  {
    title: "Ações",
    key: "actions",
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
</script>
