<template>
  <div>
    <Table
      title="Gestão de comissão consulta médica"
      :items="$all"
      :headers="headers"
      @search="handleSearch($event)"
      @add="showForm = true"
      :loading="loading"
      :show-crud="false"
    >
      <template #top-table>
        <div class="d-flex justify-end">
          <v-btn
            color="info"
            variant="flat"
            size="small"
            class="text-none"
            @click="showUpdateComissions = true"
          >
            <v-icon icon="mdi-reload" size="20" start></v-icon>
            Atualizar valores comissão
          </v-btn>
        </div>
      </template>
      <template v-slot:item.name="{ item }">
        <span
          style="cursor: pointer"
          class="d-flex align-center text-info"
          @click="getItemEdit(item)"
        >
          <v-icon icon="mdi-account-outline" size="24" start />
          <span>{{ item.name }}</span>
        </span>
      </template>
      <template v-slot:item.phone="{ item }">
        <span class="d-flex align-center">
          <v-icon icon="mdi-whatsapp" size="24" color="green" start />
          <span>
            {{
              item.phone ? formatTelephoneNumber(item.phone) : "Não informado"
            }}
          </span>
        </span>
      </template>
      <template v-slot:item.email="{ item }">
        <span class="d-flex align-center">
          <v-icon icon="mdi-email-outline" size="24" color="warning" start />
          <span>
            {{ item.email }}
          </span>
        </span>
      </template>
      <template v-slot:item.comissionValue="{ item }">
        <div class="d-flex align-center mt-6" style="gap: 0.5rem">
          <CurrencyInput
            v-model="item.comissionValue"
            label="Valor comissão"
            style="width: 6rem"
          />
          <SelectInput
            v-model="item.comissionType"
            :items="consultationValueTypes"
            label="Tipo comissão"
            :hide-details="true"
            item-title="label"
            item-value="value"
            class="mt-n6"
            style="width: 8rem"
          />
        </div>
      </template>

      <template v-slot:item.active="{ item }">
        <span class="d-flex align-center">
          <v-icon
            :icon="item.active ? 'mdi-check-circle' : 'mdi-cancel'"
            size="24"
            :color="item.active ? 'green' : 'error'"
            start
          />
        </span>
      </template>
      <!-- <template v-slot:item.actions="{ item }">
        <v-btn
          color="info"
          variant="text"
          size="small"
          class="text-none"
          @click="handleUpdateComissrionValue(item)"
        >
          <v-icon icon="mdi-reload" size="20" start></v-icon>
          Atualizar valor
        </v-btn>
      </template> -->
    </Table>
  </div>

  <MedicForm
    width="800"
    title="Médico"
    :show="showForm"
    :data="selected"
    @close="handleCloseForm"
  />
  <Dialog
    title="CONFIRME"
    :dialog="showUpdateComissions"
    @cancel="showUpdateComissions = false"
    @confirm="handleUpdateAllComissions"
    show-cancel
  >
    <span
      >Tem certeza que deseja atualizar o valor de todas as comissões ?
    </span>
  </Dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
const medicStore = useMedicStore();
const { formatTelephoneNumber } = useUtils();
const $all = computed(() => medicStore.$all);

const consultationValueTypes = [
  {
    label: "Valor em R$",
    value: "V",
  },
  {
    label: "% Porcentagem",
    value: "P",
  },
];
const selected = ref<UserProps>();
const loading = ref(false);
const showForm = ref(false);
const showUpdateComissions = ref(false);

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
    title: "Comissão consulta",
    key: "comissionValue",
  },
  // {
  //   title: "Ações",
  //   key: "actions",
  // },
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

// const getItemDelete = (item: UserProps) => {
//   selected.value = item;
//   showUpdateComissions.value = true;
// };

// const handleDeleteItem = async () => {
//   showUpdateComissions.value = false;
//   loading.value = true;
//   try {
//     await medicStore.destroy(selected.value?.publicId!);
//     await handleSearch("", false);
//   } finally {
//     loading.value = false;
//   }
// };

// const handleUpdateComissrionValue = async (item: UserProps) => {
//   loading.value = true;
//   try {
//     await medicStore.update(item);
//     await handleSearch("", false);
//   } finally {
//     loading.value = false;
//   }
// };

const handleUpdateAllComissions = async () => {
  loading.value = true;
  try {
    $all.value.forEach(async (item) => {
      await medicStore.update(item);
    });
    await handleSearch("", false);
  } finally {
    loading.value = false;
    showUpdateComissions.value = false;
  }
};
</script>
