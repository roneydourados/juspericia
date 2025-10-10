<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud
      ref="formCrudRef"
      :on-submit="submitForm"
      :show-submit-button="false"
    >
      <v-tabs v-model="tab" color="primary">
        <v-tab value="personalData" class="text-none">
          <span class="text-primary" style="font-weight: 500">
            Dados Pessoais
          </span>
        </v-tab>
        <v-tab value="bankData" class="text-none">
          <span class="text-primary" style="font-weight: 500">
            Dados Bancários
          </span>
        </v-tab>
        <v-tab value="address" class="text-none">
          <span class="text-primary" style="font-weight: 500"> Endereço </span>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="mt-4">
        <v-tabs-window-item value="personalData">
          <v-row dense>
            <v-col cols="12"> </v-col>
            <v-col cols="12" lg="6">
              <StringInput
                v-model="model.name"
                label="Nome"
                placeholder="Nome"
                required
              />
            </v-col>
            <v-col cols="12" lg="6">
              <StringInput
                v-model="model.email"
                label="E-mail"
                placeholder="E-mail"
                required
                is-lower-case
              />
            </v-col>
            <v-col cols="12" lg="4">
              <TelefoneInput
                v-model="model.phone"
                label="Telefone"
                placeholder="Telefone"
              />
            </v-col>
            <v-col cols="12" lg="4">
              <CPFInput
                v-model="model.cpfCnpj"
                label="CPF"
                placeholder="CPF"
                required
              />
            </v-col>
            <v-col cols="12" lg="4">
              <PasswordInput
                v-model="model.password"
                label="Senha temporária"
                placeholder="crie uma senha temporária"
                :required="!model.id"
                :strong="!!(model.id && model.id > 0 && model.password)"
              />
            </v-col>
            <!-- <v-col cols="12" lg="6">
              <SelectSearchProfileSeller v-model="model.profile" required />
            </v-col> -->
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="bankData">
          <v-row dense>
            <v-col cols="12"> </v-col>
            <v-col cols="12" lg="4">
              <StringInput
                v-model="model.bankName"
                label="Banco"
                placeholder="Banco"
                :clearable="true"
              />
            </v-col>
            <v-col cols="12" lg="4">
              <StringInput
                v-model="model.bankAgency"
                label="Agência"
                placeholder="Agência"
                :clearable="true"
              />
            </v-col>
            <v-col cols="12" lg="4">
              <TextInput
                v-model="model.pixKey"
                label="Chave Pix"
                placeholder="Chave Pix"
                :clearable="true"
                rows="1"
              />
            </v-col>
            <v-col cols="12" lg="4">
              <StringInput
                v-model="model.bankAccountNumber"
                label="Nº Conta"
                placeholder="999999"
                :clearable="true"
              />
            </v-col>
            <v-col cols="12" lg="4">
              <SelectInput
                v-model="model.bankAccountType"
                label="Tipo Conta"
                placeholder="999999"
                :clearable="true"
                item-title="text"
                item-value="value"
                :items="[
                  { text: 'Conta Corrente', value: 'CONTA_CORRENTE' },
                  { text: 'Conta Poupança', value: 'CONTA_POUPANCA' },
                ]"
              />
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="address">
          <v-row dense>
            <v-col cols="12"> </v-col>
            <v-col cols="12" lg="3">
              <CepInput
                label="Cep"
                icon="mdi-map-marker-radius-outline"
                :clearable="true"
                v-model="model.cepAddress.cep"
                v-model:model-address="model.cepAddress"
              />
            </v-col>
            <v-col cols="12" lg="7">
              <StringInput
                label="Rua"
                :clearable="true"
                v-model:model-value="model.cepAddress.logradouro"
              />
            </v-col>
            <v-col cols="12" lg="2">
              <StringInput
                label="Nº"
                :clearable="true"
                v-model:model-value="model.cepAddress.numero"
              />
            </v-col>
            <v-col cols="12" lg="5">
              <StringInput
                label="Bairro"
                :clearable="true"
                v-model:model-value="model.cepAddress.bairro"
              />
            </v-col>
            <v-col cols="12" lg="5">
              <StringInput
                label="Cidade"
                :clearable="true"
                v-model:model-value="model.cepAddress.localidade"
              />
            </v-col>
            <v-col cols="12" md="2">
              <StatesSelectSearch v-model="model.cepAddress.uf" />
            </v-col>
            <v-col cols="12">
              <StringInput
                label="Complemento"
                :clearable="true"
                v-model:model-value="model.cepAddress.complemento"
              />
            </v-col>
          </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
      <v-row dense class="px-8">
        <v-col cols="12" lg="2">
          <v-switch
            v-model="model.active"
            color="success"
            :label="model.active ? 'Ativo' : 'Inativo'"
            hide-details
          />
        </v-col>
        <v-col cols="12" lg="10" class="d-flex justify-end">
          <Button color="primary" variant="flat" size="small" type="submit">
            <div class="d-flex align-center">
              <v-icon icon="mdi-check" start />
              <span class="text-caption"> Salvar </span>
            </div>
          </Button>
        </v-col>
      </v-row>

      <!-- <v-row dense>
        <v-col cols="12" class="d-flex justify-end px-8">
          <v-switch
            v-model="model.active"
            color="success"
            :label="model.active ? 'Ativo' : 'Inativo'"
            hide-details
          ></v-switch>
        </v-col>
      </v-row> -->
    </FormCrud>
  </DialogForm>
  <!-- <DialogLoading :dialog="loading" /> -->
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "500",
  },
  data: {
    type: Object as PropType<UserProps>,
    default: () => ({}),
  },
});
const emit = defineEmits(["close"]);

const { mobile } = useDisplay();

const attendentStore = useUserAtendentStore();
const formCrudRef = ref();
const tab = ref(1);
const tabs = ref([
  { title: "Dados Pessoais", icon: "mdi-account" },
  { title: "Dados Bancários", icon: "mdi-bank" },
  { title: "Endereço", icon: "mdi-map" },
]);

// const loading = ref(false);
const model = ref({
  id: 0,
  name: "",
  email: "",
  cpfCnpj: "",
  password: "",
  phone: "",
  active: true,
  cepAddress: {
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
    numero: "",
  } as CepAdderssProps,
  //profile: undefined as ProfileProps | undefined,
  pixKey: "",
  bankName: "",
  bankAgency: "",
  bankAccountNumber: "",
  bankAccountType: "CONTA_CORRENTE",
});

const clearModel = () => {
  model.value = {
    id: 0,
    name: "",
    phone: "",
    cpfCnpj: "",
    password: "",
    email: "",
    active: true,
    cepAddress: {
      cep: "",
      logradouro: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
      numero: "",
    },
    //profile: undefined,
    pixKey: "",
    bankName: "",
    bankAgency: "",
    bankAccountNumber: "",
    bankAccountType: "CONTA_CORRENTE",
  };
};

watchEffect(() => {
  if (props.data.id && props.show) {
    loadModel();
  } else if (!props.data.id && props.show) {
    clearModel();
  }
});

const loadModel = () => {
  model.value = {
    id: props.data.id ?? 0,
    name: props.data.name ?? "",
    phone: props.data.phone ?? "",
    cpfCnpj: props.data.cpfCnpj ?? "",
    password: "",
    email: props.data.email ?? "",
    active: props.data.active ?? false,
    cepAddress: {
      cep: props.data.UserAddress?.addressZipcode ?? "",
      logradouro: props.data.UserAddress?.addressStreet ?? "",
      complemento: props.data.UserAddress?.addressComplement ?? "",
      bairro: props.data.UserAddress?.addressDistrict ?? "",
      localidade: props.data.UserAddress?.addressCity ?? "",
      uf: props.data.UserAddress?.addressState ?? "",
      numero: props.data.UserAddress?.addressNumber ?? "",
    },
    //profile: props.data.profile,
    pixKey: props.data.pixKey ?? "",
    bankName: props.data.bankName ?? "",
    bankAgency: props.data.bankAgency ?? "",
    bankAccountNumber: props.data.bankAccountNumber ?? "",
    bankAccountType: props.data.bankAccountType ?? "CONTA_CORRENTE",
  };
};

const submitForm = async () => {
  // loading.value = true;
  try {
    if (model.value.id && model.value.id > 0) {
      await update();
    } else {
      await create();
    }
    await attendentStore.index("");
    handleClose();
  } finally {
    // loading.value = false;
    formCrudRef.value?.resetForm();
  }
};

const create = async () => {
  await attendentStore.create({
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    password: model.value.password,
    UserAddress: {
      addressCity: model.value.cepAddress.localidade,
      addressComplement: model.value.cepAddress.complemento,
      addressDistrict: model.value.cepAddress.bairro,
      addressNumber: model.value.cepAddress.numero,
      addressState: model.value.cepAddress.uf,
      addressStreet: model.value.cepAddress.logradouro,
      addressZipcode: model.value.cepAddress.cep,
    },
    active: model.value.active,
    //profileId: model.value.profile?.id,
    pixKey: model.value.pixKey,
    bankName: model.value.bankName,
    bankAgency: model.value.bankAgency,
    bankAccountNumber: model.value.bankAccountNumber,
    bankAccountType: model.value.bankAccountType,
  });
};

const update = async () => {
  await attendentStore.update({
    publicId: props.data.publicId!,
    id: model.value.id,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    password: model.value.password,
    active: model.value.active,
    UserAddress: {
      addressCity: model.value.cepAddress.localidade,
      addressComplement: model.value.cepAddress.complemento,
      addressDistrict: model.value.cepAddress.bairro,
      addressNumber: model.value.cepAddress.numero,
      addressState: model.value.cepAddress.uf,
      addressStreet: model.value.cepAddress.logradouro,
      addressZipcode: model.value.cepAddress.cep,
    },
    //profileId: model.value.profile?.id,
    pixKey: model.value.pixKey,
    bankName: model.value.bankName,
    bankAgency: model.value.bankAgency,
    bankAccountNumber: model.value.bankAccountNumber,
    bankAccountType: model.value.bankAccountType,
  });
};

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
