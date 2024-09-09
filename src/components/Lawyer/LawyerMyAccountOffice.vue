<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados escritório </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row dense>
          <v-col cols="12" lg="6">
            <StringInput
              v-model="model.officeName"
              label="Escritório"
              placeholder="Nome do escritório"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <StringInput
              v-model="model.officeEmail"
              label="E-mail"
              placeholder="E-mail"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="3">
            <TelefoneInput
              v-model:model-number="model.officePhone.value"
              v-model:model-value="model.officePhone.text"
              label="Telefone"
              placeholder="Telefone"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <CNPJInput
              v-model:model-value="model.officeCnpj.text"
              v-model:model-number="model.officeCnpj.value"
              label="CNPJ"
              placeholder="CNPJ"
              required
            />
          </v-col>
          <!-- <v-col cols="12" lg="3">
            <StringInput
              v-model="model.oab"
              label="Nª OAB"
              placeholder="Nª OAB"
              required
            />
          </v-col>
          <v-col cols="12" lg="3">
            <StatesSelectSearch
              v-model="model.oabUf"
              label="UF OAB"
              placeholder="UF OAB"
              required
            />
          </v-col> -->
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const userLawyerStore = useUserLawyerStore();

const $currentUser = computed(() => auth.$currentUser);

const loading = ref(false);

const model = defineModel<UserModelProps>("model", {
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const submitForm = async () => {
  loading.value = true;
  try {
    await update();
    await userLawyerStore.show($currentUser.value!.id!);
  } finally {
    loading.value = false;
  }
};

const update = async () => {
  await userLawyerStore.update({
    id: model.value?.id,
    email: model.value?.email,
    name: model.value?.name,
    phone: model.value?.phone?.value,
    cpfCnpj: model.value?.cpfCnpj.value,
    //password: model.value?.password,
    active: model.value?.active,
    oab: model.value?.oab,
    oabUf: model.value?.oabUf,
    officeName: model.value?.officeName,
    officeCnpj: model.value?.officeCnpj.value,
    officeEmail: model.value?.officeEmail,
    officePhone: model.value?.officePhone.value,
  });
};
</script>
