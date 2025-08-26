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
            <v-list v-if="!mobile" @click:select="handleMenuClick($event)">
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
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const medicStore = useMedicStore();
const $single = computed(() => medicStore.$single);

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
  phone: "",
  crm: "",
  crmUf: "",
  active: true,
  cepAddress: {
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    numero: "",
    uf: "",
  },
});

const loadModel = () => {
  model.value = {
    id: $single.value?.id!,
    name: $single.value?.name ?? "",
    email: $single.value?.email ?? "",
    password: "",
    confirmPassword: "",
    phone: $single.value?.phone ?? "",
    crm: $single.value?.crm ?? "",
    crmUf: $single.value?.crmUf ?? "",
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
  };
};

watch(
  () => $single.value,
  () => {
    if (!model.value.id) {
      loadModel();
    }
  },
  { immediate: true }
);

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
      phone: model.value?.phone,
      password: model.value?.password ? model.value?.password : undefined,
      active: model.value?.active,
      crm: model.value?.crm,
      crmUf: model.value?.crmUf,
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
.selected-item {
  background-color: rgb(var(--v-theme-backMenu)) !important;
  color: rgb(var(--v-theme-itemInternalMenu)) !important;
}

.v-list,
.v-list-item {
  background: transparent !important;
}
</style>
