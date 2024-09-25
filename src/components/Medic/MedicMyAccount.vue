<template>
  <div>
    <v-card class="mx-auto" flat rounded="lg" max-width="1200" height="500">
      <v-card-title>
        <HeaderPage title="Minha Conta" />
      </v-card-title>
      <v-card-text class="px-6">
        <v-row dende>
          <v-col cols="12" lg="3">
            <v-list @click:select="handleMenuClick($event)">
              <v-list-item
                v-for="(item, i) in itemsList"
                :key="i"
                :value="item.title"
                :class="{ 'selected-item': selectedItem === item.title }"
                color="primary"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <template #subtitle>
                  <span style="font-size: 0.9rem">{{ item.title }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" lg="9">
            <MedicMyAccountAddress
              v-model:model="model"
              v-if="selectedItem === 'Endereço'"
              @update="handleUpdate"
            />
            <MedicMyAccountAccessData
              v-model:model="model"
              v-else-if="selectedItem === 'Dados de acesso'"
              @update="handleUpdate"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <DialogLoading :dialog="loading" />
  </div>
</template>

<script setup lang="ts">
import { formatCEP } from "@brazilian-utils/brazilian-utils";
const medicStore = useMedicStore();
const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();
const $single = computed(() => medicStore.$single);
const $currentMedic = computed(() => medicStore.$single);

const selectedItem = ref("Dados de acesso");
const loading = ref(false);

const itemsList = ref([
  {
    title: "Dados de acesso",
    icon: "mdi-login",
  },
  {
    title: "Endereço",
    icon: "mdi-map-marker",
  },
]);

const model = ref<UserMedicModelProps>({
  id: 0,
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: {
    text: "",
    value: "",
  },
  crm: "",
  crmUf: "",
  active: true,
  Address: {
    addressCity: "",
    addressComplement: "",
    addressDistrict: "",
    addressNumber: "",
    addressState: "",
    addressStreet: "",
    addressZipcode: "",
  },
  CepData: {
    CepAddress: undefined,
    text: "",
    value: "",
  },
});

onMounted(() => {
  loadModel();
});

const loadModel = () => {
  model.value = {
    id: $single.value?.id!,
    name: $single.value?.name ?? "",
    email: $single.value?.email ?? "",
    password: "",
    confirmPassword: "",
    phone: {
      text: formatTelephoneNumber($single.value?.phone ?? ""),
      value: $single.value?.phone ?? "",
    },
    crm: $single.value?.crm ?? "",
    crmUf: $single.value?.crmUf ?? "",
    active: $single.value?.active ?? true,
    Address: {
      addressCity: $single.value?.Address?.addressCity ?? "",
      addressComplement: $single.value?.Address?.addressComplement ?? "",
      addressDistrict: $single.value?.Address?.addressDistrict ?? "",
      addressNumber: $single.value?.Address?.addressNumber ?? "",
      addressState: $single.value?.Address?.addressState ?? "",
      addressStreet: $single.value?.Address?.addressStreet ?? "",
      addressZipcode: $single.value?.Address?.addressZipcode ?? "",
    },
    CepData: {
      CepAddress: undefined,
      text: formatCEP($single.value?.Address?.addressZipcode ?? ""),
      value: $single.value?.Address?.addressZipcode ?? "",
    },
  };
};

const handleMenuClick = (event: any) => {
  const item = event as { id: string; value: boolean };
  selectedItem.value = item.id;
};

const handleUpdate = async () => {
  loading.value = true;
  try {
    await medicStore.update({
      publicId: $single.value?.publicId,
      id: model.value?.id,
      email: model.value?.email,
      name: model.value?.name,
      phone: model.value?.phone?.value,
      password: model.value?.password ? model.value?.password : undefined,
      active: model.value?.active,
      crm: model.value?.crm,
      crmUf: model.value?.crmUf,
      Address: {
        addressCity: model.value.Address.addressCity,
        addressComplement: model.value.Address.addressComplement,
        addressDistrict: model.value.Address.addressDistrict,
        addressNumber: model.value.Address.addressNumber,
        addressState: model.value.Address.addressState,
        addressStreet: model.value.Address.addressStreet,
        addressZipcode: model.value.CepData.value,
      },
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.selected-item {
  background-color: rgb(var(--v-theme-backMenu)) !important;
  color: rgb(var(--v-theme-itemMenu)) !important;
}
</style>
