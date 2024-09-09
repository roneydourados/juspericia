<template>
  <div>
    <v-card class="mx-auto" flat rounded="lg" max-width="1200">
      <v-card-title>
        <HeaderPage title="Minha Conta" />
      </v-card-title>
      <v-card-text class="px-6">
        <v-row dende>
          <v-col cols="12" lg="3">
            <v-list
              selected-strategyy="single"
              @click:select="handleMenuClick($event)"
            >
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

                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" lg="9">
            <LawyerMyAccountPersonalData
              v-model:model="model"
              v-if="selectedItem === 'Dados Pessoais'"
            />
            <LawyerMyAccountAddress
              v-model:model="model"
              v-else-if="selectedItem === 'Endereço'"
            />
            <LawyerMyAccountOffice
              v-model:model="model"
              v-else-if="selectedItem === 'Escritório'"
            />
            <LawyerMyAccountAccessData
              v-model:model="model"
              v-else-if="selectedItem === 'Dados de acesso'"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { formatCEP } from "@brazilian-utils/brazilian-utils";
const auth = useAuthStore();
const userLawyerStore = useUserLawyerStore();
const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();
const $currentUser = computed(() => auth.$currentUser);
const $single = computed(() => userLawyerStore.$single);

const selectedItem = ref("Dados Pessoais");

const itemsList = ref([
  {
    title: "Dados Pessoais",
    icon: "mdi-account-outline",
  },
  {
    title: "Endereço",
    icon: "mdi-map-marker",
  },
  {
    title: "Escritório",
    icon: "mdi-office-building",
  },
  {
    title: "Dados de acesso",
    icon: "mdi-login",
  },
]);

const model = ref<UserModelProps>({
  id: 0,
  name: "",
  email: "",
  cpfCnpj: {
    text: "",
    value: "",
  },
  password: "",
  confirmPassword: "",
  phone: {
    text: "",
    value: "",
  },
  oab: "",
  oabUf: "",
  officeName: "",
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
  officePhone: {
    text: "",
    value: "",
  },
  officeEmail: "",
  officeCnpj: {
    text: "",
    value: "",
  },
});

onMounted(async () => {
  await userLawyerStore.show($currentUser.value!.id!);
  loadModel();
});

const loadModel = () => {
  model.value = {
    id: $single.value?.id,
    name: $single.value?.name ?? "",
    email: $single.value?.email ?? "",
    cpfCnpj: {
      text: formatCPFOrCNPJ($single.value?.cpfCnpj ?? ""),
      value: $single.value?.cpfCnpj ?? "",
    },
    password: "",
    confirmPassword: "",
    phone: {
      text: formatTelephoneNumber($single.value?.phone ?? ""),
      value: $single.value?.phone ?? "",
    },
    oab: $single.value?.oab ?? "",
    oabUf: $single.value?.oabUf ?? "",
    officeName: $single.value?.officeName ?? "",
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
    officePhone: {
      text: formatTelephoneNumber($single.value?.officePhone ?? ""),
      value: $single.value?.officePhone ?? "",
    },
    officeEmail: $single.value?.officeEmail ?? "",
    officeCnpj: {
      text: formatCPFOrCNPJ($single.value?.officeCnpj ?? ""),
      value: $single.value?.officeCnpj ?? "",
    },
  };
};

const handleMenuClick = (event: any) => {
  const item = event as { id: string; value: boolean };
  selectedItem.value = item.id;
};
</script>

<style scoped>
.selected-item {
  background-color: rgb(var(--v-theme-backMenu)) !important;
  color: rgb(var(--v-theme-itemMenu)) !important;
}
</style>
