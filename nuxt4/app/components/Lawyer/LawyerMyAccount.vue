<template>
  <div>
    <v-card
      class="mx-auto"
      flat
      rounded="lg"
      max-width="1200"
      color="transparent"
    >
      <v-card-title>
        <HeaderPage title="Minha Conta" />
      </v-card-title>
      <v-card-text class="px-6">
        <v-row dense>
          <v-col cols="12" lg="3">
            <v-list
              v-if="!mobile"
              color="transparent"
              @click:select="handleMenuClick($event)"
            >
              <v-list-item
                v-for="(item, i) in itemsList"
                :key="i"
                :value="item.title"
                active-class="item-menu"
                color="transparent"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <template #subtitle>
                  <span style="font-size: 0.9rem">{{ item.title }}</span>
                </template>
              </v-list-item>
            </v-list>
            <v-tabs v-else>
              <v-tab
                v-for="(item, i) in itemsList"
                :key="i"
                :value="item.title"
                @click="selectedItem = item.title"
                color="primary"
                density="compact"
                grow
              >
                <v-icon :icon="item.icon" class="mr-2"></v-icon>
                <span class="text-caption">
                  {{ item.title }}
                </span>
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="12" lg="9">
            <LawyerMyAccountPersonalData
              v-model:model="model"
              v-if="selectedItem === 'Dados Pessoais'"
              @update="handleUpdate"
            />
            <LawyerMyAccountAddress
              v-model:model="model"
              v-else-if="selectedItem === 'Endereço'"
              @update="handleUpdate"
            />
            <LawyerMyAccountOffice
              v-model:model="model"
              v-else-if="selectedItem === 'Escritório'"
              @update="handleUpdate"
            />
            <LawyerMyAccountAccessData
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
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const auth = useAuthStore();
const userLawyerStore = useUserLawyerStore();
const $currentUser = computed(() => auth.$currentUser);
const $single = computed(() => userLawyerStore.$single);

const selectedItem = ref("Dados Pessoais");
const loading = ref(false);

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
  cpfCnpj: "",
  password: "",
  confirmPassword: "",
  phone: "",
  whatsapp: "",
  oab: "",
  oabUf: "",
  officeName: "",
  active: true,
  officePhone: "",
  officeEmail: "",
  officeCpfCnpj: "",
  officePersonType: "F",
  cepAddress: {
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    numero: "",
    uf: "",
  },
  tokenCapcha: "",
});

onMounted(async () => {
  await userLawyerStore.show($currentUser.value!.publicId!);
  loadModel();
});

const loadModel = () => {
  model.value = {
    id: $single.value?.id,
    name: $single.value?.name ?? "",
    email: $single.value?.email ?? "",
    cpfCnpj: $single.value?.cpfCnpj ?? "",
    password: "",
    confirmPassword: "",
    phone: $single.value?.phone ?? "",
    whatsapp: $single.value?.whatsapp ?? "",
    oab: $single.value?.oab ?? "",
    oabUf: $single.value?.oabUf ?? "",
    officeName: $single.value?.officeName ?? "",
    active: $single.value?.active ?? true,
    cepAddress: {
      cep: $single.value?.UserAddress?.addressZipcode ?? "",
      logradouro: $single.value?.UserAddress?.addressStreet ?? "",
      complemento: $single.value?.UserAddress?.addressComplement ?? "",
      bairro: $single.value?.UserAddress?.addressDistrict ?? "",
      localidade: $single.value?.UserAddress?.addressCity ?? "",
      numero: $single.value?.UserAddress?.addressNumber ?? "",
      uf: $single.value?.UserAddress?.addressState ?? "",
    },
    officePhone: $single.value?.officePhone ?? "",
    officeEmail: $single.value?.officeEmail ?? "",
    officeCpfCnpj: $single.value?.officeCpfCnpj ?? "",
    officePersonType: $single.value?.officePersonType ?? "F",
    tokenCapcha: $single.value?.tokenCapcha ?? "",
  };
};

const handleMenuClick = (event: any) => {
  const item = event as { id: string; value: boolean };
  selectedItem.value = item.id;
};

const handleUpdate = async () => {
  loading.value = true;
  try {
    await userLawyerStore.update({
      publicId: $single.value?.publicId,
      id: model.value?.id,
      email: model.value?.email,
      name: model.value?.name,
      phone: model.value?.phone,
      whatsapp: model.value?.whatsapp,
      cpfCnpj: model.value?.cpfCnpj,
      password: model.value?.password ? model.value?.password : undefined,
      active: model.value?.active,
      oab: model.value?.oab,
      oabUf: model.value?.oabUf,
      officeName: model.value?.officeName,
      officePersonType: model.value?.officePersonType,
      officePhone: model.value?.officePhone,
      officeCpfCnpj: model.value?.officeCpfCnpj,
      UserAddress: {
        addressCity: model.value.cepAddress.localidade,
        addressComplement: model.value.cepAddress.complemento,
        addressDistrict: model.value.cepAddress.bairro,
        addressNumber: model.value.cepAddress.numero,
        addressState: model.value.cepAddress.uf,
        addressStreet: model.value.cepAddress.logradouro,
        addressZipcode: model.value.cepAddress.cep,
      },
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-list,
.v-list-item {
  background: transparent !important;
}

.item-menu {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-itemMenu)) !important;
}
</style>
