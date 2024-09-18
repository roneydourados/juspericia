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
            v-model:model-number="model.phone.value"
            v-model:model-value="model.phone.text"
            label="Telefone"
            placeholder="Telefone"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <StringInput
            v-model="model.crm"
            label="CRM"
            placeholder="CRM"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <StatesSelectSearch
            v-model="model.crmUf"
            label="UF CRM"
            placeholder="UF CRM"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4">
          <CPFInput
            v-model:model-value="model.cpfCnpj.text"
            v-model:model-number="model.cpfCnpj.value"
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
        <v-col cols="12" lg="4">
          <v-switch
            v-model="model.active"
            color="success"
            :label="model.active ? 'Ativo' : 'Inativo'"
            hide-details
          ></v-switch>
        </v-col>
      </v-row>
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
  </DialogForm>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { useDisplay } from "vuetify";
import Loading from "../UI/infos/Loading.vue";
import { formatCEP } from "@brazilian-utils/brazilian-utils";

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
const medicStore = useMedicStore();

const loading = ref(false);
const model = ref({
  id: 0,
  name: "",
  email: "",
  cpfCnpj: {
    text: "",
    value: "",
  },
  password: "",
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
    CepAddress: undefined as CepAdderssProps | undefined,
    text: "",
    value: "",
  },
});

const setAddress = (address: CepAdderssProps) => {
  model.value.Address.addressCity = address.localidade ?? "";
  model.value.Address.addressDistrict = address.bairro ?? "";
  model.value.Address.addressState = address.uf ?? "";
  model.value.Address.addressComplement = address.complemento ?? "";
  model.value.Address.addressStreet = address.logradouro ?? "";
};

const clearModel = () => {
  model.value = {
    id: 0,
    name: "",
    phone: {
      text: "",
      value: "",
    },
    cpfCnpj: {
      text: "",
      value: "",
    },
    password: "",
    crm: "",
    crmUf: "",
    email: "",
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
      CepAddress: undefined as CepAdderssProps | undefined,
      text: "",
      value: "",
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
    phone: {
      text: formatTelephoneNumber(props.data.phone ?? ""),
      value: props.data.phone ?? "",
    },
    cpfCnpj: {
      text: formatCPFOrCNPJ(props.data.cpfCnpj ?? ""),
      value: props.data.cpfCnpj ?? "",
    },
    password: "",
    crm: props.data.crm ?? "",
    crmUf: props.data.crmUf ?? "",
    email: props.data.email ?? "",
    active: props.data.active ?? false,
    Address: {
      addressCity: props.data.Address?.addressCity ?? "",
      addressComplement: props.data.Address?.addressComplement ?? "",
      addressDistrict: props.data.Address?.addressDistrict ?? "",
      addressNumber: props.data.Address?.addressNumber ?? "",
      addressState: props.data.Address?.addressState ?? "",
      addressStreet: props.data.Address?.addressStreet ?? "",
      addressZipcode: props.data.Address?.addressZipcode ?? "",
    },
    CepData: {
      CepAddress: undefined,
      text: formatCEP(props.data.Address?.addressZipcode ?? ""),
      value: props.data.Address?.addressZipcode ?? "",
    },
  };
};

const submitForm = async () => {
  Loading.value = true;
  try {
    if (model.value.id && model.value.id > 0) {
      await update();
    } else {
      await create();
    }

    await medicStore.index("");
    handleClose();
  } finally {
    Loading.value = false;
  }
};

const create = async () => {
  await medicStore.create({
    crm: model.value.crm,
    crmUf: model.value.crmUf,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone.value,
    cpfCnpj: model.value.cpfCnpj.value,
    password: model.value.password,
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

const update = async () => {
  await medicStore.update({
    publicId: props.data.publicId!,
    id: model.value.id,
    crm: model.value.crm,
    crmUf: model.value.crmUf,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone.value,
    cpfCnpj: model.value.cpfCnpj.value,
    password: model.value.password,
    active: model.value.active,
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

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
