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

      <div class="py-4">
        <strong>Pametrização consulta</strong>
      </div>
      <v-row dense>
        <v-col cols="12" lg="2">
          <TimeInput
            v-model="model.medicHourStart"
            label="Hora de início"
            placeholder="08:00"
            required
          />
        </v-col>
        <v-col cols="12" lg="2">
          <TimeInput
            v-model="model.medicHourEnd"
            label="Hora de fim"
            placeholder="20:00"
            required
          />
        </v-col>
        <!-- <v-col cols="12" lg="4" class="d-flex align-center" style="gap: 0.5rem">
          <IntegerInput
            v-model="model.medicQueryInterval"
            label="Intervalo entre consultas"
            placeholder="15"
            required
          />
          <strong>minutos</strong>
        </v-col> -->
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <strong>Dias da semana</strong>
        </v-col>
        <v-col cols="12" lg="2">
          <v-checkbox v-model="model.seg" label="Seg" />
        </v-col>
        <v-col cols="12" lg="2">
          <v-checkbox v-model="model.ter" label="Ter" />
        </v-col>
        <v-col cols="12" lg="2">
          <v-checkbox v-model="model.qua" label="Qua" />
        </v-col>
        <v-col cols="12" lg="2">
          <v-checkbox v-model="model.qui" label="Qui" />
        </v-col>
        <v-col cols="12" lg="2">
          <v-checkbox v-model="model.sex" label="Sex" />
        </v-col>
        <v-col cols="12" lg="2">
          <v-checkbox label="Sab" v-model="model.sab" />
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

const medicStore = useMedicStore();

const loading = ref(false);
const model = ref({
  id: 0,
  name: "",
  email: "",
  cpfCnpj: "",
  password: "",
  phone: "",
  crm: "",
  crmUf: "",
  medicHourStart: "",
  medicHourEnd: "",
  medicQueryInterval: "15",
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
  seg: false,
  ter: false,
  qua: false,
  qui: false,
  sex: false,
  sab: false,
  dom: false,
});

const clearModel = () => {
  model.value = {
    id: 0,
    name: "",
    phone: "",
    cpfCnpj: "",
    password: "",
    crm: "",
    crmUf: "",
    email: "",
    medicHourStart: "",
    medicHourEnd: "",
    medicQueryInterval: "",
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
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
    dom: false,
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
    medicHourStart: props.data.medicHourStart ?? "",
    medicHourEnd: props.data.medicHourEnd ?? "",
    medicQueryInterval: props.data.medicQueryInterval
      ? props.data.medicQueryInterval.toString()
      : "",
    password: "",
    crm: props.data.crm ?? "",
    crmUf: props.data.crmUf ?? "",
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
    seg: props.data.seg ?? false,
    ter: props.data.ter ?? false,
    qua: props.data.qua ?? false,
    qui: props.data.qui ?? false,
    sex: props.data.sex ?? false,
    sab: props.data.sab ?? false,
    dom: props.data.dom ?? false,
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

    await medicStore.index("");
    handleClose();
  } finally {
    loading.value = false;
  }
};

const create = async () => {
  await medicStore.create({
    crm: model.value.crm,
    crmUf: model.value.crmUf,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    password: model.value.password,
    medicHourStart: model.value.medicHourStart,
    medicHourEnd: model.value.medicHourEnd,
    medicQueryInterval: Number(model.value.medicQueryInterval ?? "15"),
    UserAddress: {
      addressCity: model.value.cepAddress.localidade,
      addressComplement: model.value.cepAddress.complemento,
      addressDistrict: model.value.cepAddress.bairro,
      addressNumber: model.value.cepAddress.numero,
      addressState: model.value.cepAddress.uf,
      addressStreet: model.value.cepAddress.logradouro,
      addressZipcode: model.value.cepAddress.cep,
    },
    seg: model.value.seg,
    ter: model.value.ter,
    qua: model.value.qua,
    qui: model.value.qui,
    sex: model.value.sex,
    sab: model.value.sab,
    dom: model.value.dom,
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
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    password: model.value.password,
    active: model.value.active,
    medicHourStart: model.value.medicHourStart,
    medicHourEnd: model.value.medicHourEnd,
    medicQueryInterval: Number(model.value.medicQueryInterval ?? "15"),
    UserAddress: {
      addressCity: model.value.cepAddress.localidade,
      addressComplement: model.value.cepAddress.complemento,
      addressDistrict: model.value.cepAddress.bairro,
      addressNumber: model.value.cepAddress.numero,
      addressState: model.value.cepAddress.uf,
      addressStreet: model.value.cepAddress.logradouro,
      addressZipcode: model.value.cepAddress.cep,
    },
    seg: model.value.seg,
    ter: model.value.ter,
    qua: model.value.qua,
    qui: model.value.qui,
    sex: model.value.sex,
    sab: model.value.sab,
    dom: model.value.dom,
  });
};

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
