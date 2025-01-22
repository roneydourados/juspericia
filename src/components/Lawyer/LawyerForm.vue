<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
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
          />
        </v-col>
      </v-row>
      <v-row dense>
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
          <StringInput
            v-model="model.password"
            label="Senha temporária"
            placeholder="crie uma senha temporária"
            :required="!model.id"
            type="password"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="5">
          <StringInput
            v-model="model.officeName"
            label="Nome do escritório"
            placeholder="Nome do escritório"
            required
          />
        </v-col>
        <v-col cols="12" lg="3">
          <CNPJInput v-model="model.officeCnpj" label="CNPJ" placeholder="" />
        </v-col>
        <v-col cols="12" lg="2">
          <StringInput
            v-model="model.oab"
            label="Nª OAB"
            placeholder="Nª OAB"
            required
          />
        </v-col>
        <v-col cols="12" lg="2">
          <StatesSelectSearch
            v-model="model.oabUf"
            label="UF OAB"
            placeholder="UF OAB"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4">
          <TelefoneInput
            v-model="model.officePhone"
            label="Telefone do escritório"
            placeholder="Telefone do escritório"
          />
        </v-col>
        <v-col cols="12" lg="8">
          <StringInput
            v-model="model.officeEmail"
            label="E-mail do escritório"
            placeholder="E-mail do escritório"
          />
        </v-col>
      </v-row>
      <v-row>
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
      </v-row>
      <v-row dense>
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
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <StringInput
            label="Complemento"
            :clearable="true"
            v-model:model-value="model.cepAddress.complemento"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4">
          <v-switch
            v-model="model.active"
            color="success"
            :label="model.active ? 'Ativo' : 'Inativo'"
            hide-details
          ></v-switch>
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
  <DialogLoading :dialog="loading" />
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
const { formatCPFOrCNPJ, formatTelephoneNumber } = useUtils();
const userLawyerStore = useUserLawyerStore();

const loading = ref(false);
const model = ref({
  id: 0,
  name: "",
  email: "",
  password: "",
  officeEmail: "",
  phone: "",
  oab: "",
  oabUf: "",
  officeName: "",
  officePhone: "",
  cpfCnpj: "",
  officeCnpj: "",
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
});

const clearModel = () => {
  model.value = {
    id: 0,
    name: "",
    phone: "",
    officeEmail: "",
    officePhone: "",
    cpfCnpj: "",
    officeCnpj: "",
    password: "",
    email: "",
    oab: "",
    oabUf: "",
    officeName: "",
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
    officePhone: props.data.officePhone ?? "",
    officeEmail: props.data.officeEmail ?? "",
    cpfCnpj: props.data.cpfCnpj ?? "",
    password: "",
    email: props.data.email ?? "",
    active: props.data.active ?? false,
    oab: props.data.oab ?? "",
    oabUf: props.data.oabUf ?? "",
    officeName: props.data.officeName ?? "",
    cepAddress: {
      cep: props.data.Address?.addressZipcode ?? "",
      logradouro: props.data.Address?.addressStreet ?? "",
      complemento: props.data.Address?.addressComplement ?? "",
      bairro: props.data.Address?.addressDistrict ?? "",
      localidade: props.data.Address?.addressCity ?? "",
      uf: props.data.Address?.addressState ?? "",
      numero: props.data.Address?.addressNumber ?? "",
    },

    officeCnpj: props.data.officeCnpj ?? "",
  };
};

const submitForm = async () => {
  loading.value = true;
  try {
    if (model.value.id && model.value.id > 0) {
      await update();
    } else {
      await create();
    }

    await userLawyerStore.index("");
    handleClose();
  } finally {
    loading.value = false;
  }
};

const create = async () => {
  await userLawyerStore.create({
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    officeCnpj: model.value.officeCnpj,
    officeEmail: model.value.officeEmail,
    officePhone: model.value.officePhone,
    password: model.value.password,
    oab: model.value.oab,
    oabUf: model.value.oabUf,
    officeName: model.value.officeName,
    Address: {
      addressCity: model.value.cepAddress.localidade,
      addressComplement: model.value.cepAddress.complemento,
      addressDistrict: model.value.cepAddress.bairro,
      addressNumber: model.value.cepAddress.numero,
      addressState: model.value.cepAddress.uf,
      addressStreet: model.value.cepAddress.logradouro,
      addressZipcode: model.value.cepAddress.cep,
    },
  });
};

const update = async () => {
  await userLawyerStore.update({
    publicId: props.data.publicId!,
    id: model.value.id,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    officeCnpj: model.value.officeCnpj,
    password: model.value.password,
    active: model.value.active,
    oab: model.value.oab,
    oabUf: model.value.oabUf,
    officeName: model.value.officeName,
    officeEmail: model.value.officeEmail,
    officePhone: model.value.officePhone,
    Address: {
      addressCity: model.value.cepAddress.localidade,
      addressComplement: model.value.cepAddress.complemento,
      addressDistrict: model.value.cepAddress.bairro,
      addressNumber: model.value.cepAddress.numero,
      addressState: model.value.cepAddress.uf,
      addressStreet: model.value.cepAddress.logradouro,
      addressZipcode: model.value.cepAddress.cep,
    },
  });
};

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
