<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="submitForm" :show-submit-button="false">
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
        <!-- <v-tab value="parameters" class="text-none">
          <span class="text-primary" style="font-weight: 500">
            Parâmetros de Consulta
          </span>
        </v-tab> -->
      </v-tabs>
      <v-tabs-window v-model="tab" class="mt-4">
        <v-tabs-window-item value="personalData">
          <v-row dense class="py-4">
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
                placeholder="crie uma senha temporária mínimo 6 digitos"
                :required="!model.id"
                :strong="!!(model.id && model.id > 0 && model.password)"
              />
            </v-col>
            <v-col cols="12" lg="8">
              <SelectSearchMedicalSpecialty
                v-model="model.medicalSpecialty"
                required
              />
            </v-col>
          </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="bankData">
          <v-row dense class="py-4">
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
          <v-row dense class="py-4">
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
          <Button
            color="primary"
            variant="flat"
            size="small"
            type="submit"
            :disabled="loading"
          >
            <div v-if="!loading" class="d-flex align-center">
              <v-icon icon="mdi-check" start />
              <span class="text-caption"> Salvar </span>
            </div>
          </Button>
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
const tab = ref("personalData");
// const tabs = ref([
//   { title: "Dados Pessoais", icon: "mdi-account" },
//   { title: "Dados Bancários", icon: "mdi-bank" },
//   { title: "Endereço", icon: "mdi-map" },
//   { title: "Parâmetros de Consulta", icon: "mdi-cog" },
// ]);
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
  pixKey: "",
  bankName: "",
  bankAgency: "",
  bankAccountNumber: "",
  bankAccountType: "CONTA_CORRENTE",
  medicalSpecialty: undefined as MedicalSpecialtyProps | undefined,
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
    pixKey: "",
    bankName: "",
    bankAgency: "",
    bankAccountNumber: "",
    bankAccountType: "CONTA_CORRENTE",
    medicalSpecialty: undefined,
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
    pixKey: props.data.pixKey ?? "",
    bankName: props.data.bankName ?? "",
    bankAgency: props.data.bankAgency ?? "",
    bankAccountNumber: props.data.bankAccountNumber ?? "",
    bankAccountType: props.data.bankAccountType ?? "CONTA_CORRENTE",
    medicalSpecialty: props.data.medicalSpecialty,
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
  } catch (error) {
    console.log(error);
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
    pixKey: model.value.pixKey,
    bankName: model.value.bankName,
    bankAgency: model.value.bankAgency,
    bankAccountNumber: model.value.bankAccountNumber,
    bankAccountType: model.value.bankAccountType,
    medicalSpecialtyId: model.value.medicalSpecialty?.id,
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
    pixKey: model.value.pixKey,
    bankName: model.value.bankName,
    bankAgency: model.value.bankAgency,
    bankAccountNumber: model.value.bankAccountNumber,
    bankAccountType: model.value.bankAccountType,
    medicalSpecialtyId: model.value.medicalSpecialty?.id,
  });
};

const handleClose = () => {
  clearModel();
  emit("close");
};
</script>
