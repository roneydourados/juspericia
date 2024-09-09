<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados de endereço </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row>
          <v-col cols="12" lg="3">
            <CepInput
              label="Cep"
              icon="mdi-map-marker-radius-outline"
              :clearable="true"
              v-model:model-value="model.CepData.text"
              v-model:model-number="model.CepData.value"
              v-model:model-address="model.CepData.CepAddress"
              @update:model-address="setAddress($event)"
            />
          </v-col>
          <v-col cols="12" lg="7">
            <StringInput
              label="Rua"
              :clearable="true"
              v-model:model-value="model.Address.addressStreet"
            />
          </v-col>
          <v-col cols="12" lg="2">
            <StringInput
              label="Nº"
              :clearable="true"
              v-model:model-value="model.Address.addressNumber"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="5">
            <StringInput
              label="Bairro"
              :clearable="true"
              v-model:model-value="model.Address.addressDistrict"
            />
          </v-col>
          <v-col cols="12" lg="5">
            <StringInput
              label="Cidade"
              :clearable="true"
              v-model:model-value="model.Address.addressCity"
            />
          </v-col>
          <v-col cols="12" md="2">
            <StatesSelectSearch v-model="model.Address.addressState" />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <StringInput
              label="Complemento"
              :clearable="true"
              v-model:model-value="model.Address.addressComplement"
            />
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const userLawyerStore = useUserLawyerStore();

const loading = ref(false);

const model = defineModel<UserModelProps>("model", {
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const submitForm = async () => {
  loading.value = true;
  try {
    await update();
    await userLawyerStore.show(model.value!.id!);
  } finally {
    loading.value = false;
  }
};

const setAddress = (address: CepAdderssProps) => {
  model.value.Address.addressCity = address.localidade ?? "";
  model.value.Address.addressDistrict = address.bairro ?? "";
  model.value.Address.addressState = address.uf ?? "";
  model.value.Address.addressComplement = address.complemento ?? "";
  model.value.Address.addressStreet = address.logradouro ?? "";
};

const update = async () => {
  await userLawyerStore.update({
    id: model.value.id,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone.value,
    cpfCnpj: model.value.cpfCnpj.value,
    password: model.value.password,
    active: model.value.active,
    oab: model.value.oab,
    oabUf: model.value.oabUf,
    officeName: model.value.officeName,
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
};
</script>
