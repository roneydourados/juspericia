<template>
  <DialogForm
    :show="show"
    :title="title"
    :width="mobile ? '' : width"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="submitForm">
      <v-row dense>
        <v-col cols="12" lg="4">
          <StringInput
            v-model="model.name"
            label="Nome"
            placeholder="Nome"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <StringInput
            v-model="model.surname"
            label="Sobrenome"
            placeholder="Sobrenome"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <SelectInput
            v-model="model.sexy"
            label="Sexo"
            placeholder="Sexo"
            item-title="title"
            item-value="value"
            :items="sexItems"
          >
            <template #items="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="String((item as any).raw.title)"
                density="compact"
              />
            </template>

            <template #item-selection="{ item }">
              <div class="d-flex align-center">
                {{ (item as any).raw.title }}
              </div>
            </template>
          </SelectInput>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4">
          <CPFInput
            v-model="model.cpf"
            label="CPF"
            placeholder="CPF"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <StringInput
            v-model="model.rg"
            label="RG"
            placeholder="RG"
            required
          />
        </v-col>
        <v-col cols="12" lg="4">
          <DatePicker
            v-model="model.birthDate"
            label="Data de Nascimento"
            placeholder="Data de Nascimento"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="8">
          <StringInput
            v-model="model.email"
            label="E-mail"
            placeholder="E-mail"
            type="email"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <TelefoneInput
            v-model="model.phone"
            label="Whatsapp"
            placeholder="Whatsapp"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <StringInput
            v-model="model.motherName"
            label="Nome da mãe"
            placeholder="Nome da mãe"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <strong>Dados de endereço</strong>
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
      <v-row v-if="$currentUser?.profile?.type === 'ADMIN'" dense>
        <v-col cols="12">
          <SelectSearchLawyer
            v-model="model.lawyer"
            clearable
            :required="$currentUser?.profile?.type === 'ADMIN'"
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
///import { formatCPF, formatCEP } from "@brazilian-utils/brazilian-utils";

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
    default: "",
  },
  data: {
    type: Object as PropType<PatientProps>,
    default: () => ({}),
  },
});

const { mobile } = useDisplay();
const itemStore = usePatientStore();
const auth = useAuthStore();
//const { formatTelephoneNumber } = useUtils();

const emit = defineEmits(["close"]);

const sexItems = ref([
  { title: "Masculino", value: "M" },
  { title: "Feminino", value: "F" },
  { title: "Não informado", value: "" },
]);

const model = ref({
  id: 0,
  name: "",
  surname: "",
  birthDate: "",
  cpf: "",
  rg: "",
  email: "",
  motherName: "",
  phone: "",
  cepAddress: {
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    uf: "",
    numero: "",
  } as CepAdderssProps,
  sexy: undefined as string | undefined,
  status: "A",
  lawyer: undefined as UserProps | undefined,
});

const $currentUser = computed(() => auth.$currentUser);

watchEffect(() => {
  if (props.data.id && props.show) {
    loadModel();
  } else if (!props.data.id && props.show) {
    clearModel();
  }
});

const submitForm = async (data: any) => {
  try {
    if (model.value.id === 0) {
      await create();
    } else {
      await update();
      await itemStore.show(props.data.publicId!);
    }
    await itemStore.index("");

    emit("close");
  } catch (error) {
    console.error(error);
  } finally {
    clearModel();
  }
};

// const setAddress = (address: CepAdderssProps) => {
//   model.value.Address.addressCity = address.localidade ?? "";
//   model.value.Address.addressDistrict = address.bairro ?? "";
//   model.value.Address.addressState = address.uf ?? "";
//   model.value.Address.addressComplement = address.complemento ?? "";
//   model.value.Address.addressStreet = address.logradouro ?? "";
// };

const clearModel = () => {
  model.value = {
    id: 0,
    name: "",
    surname: "",
    birthDate: "",
    cpf: "",
    rg: "",
    email: "",
    motherName: "",
    phone: "",
    sexy: undefined,
    status: "A",
    cepAddress: {
      cep: "",
      logradouro: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
      numero: "",
    },
    lawyer: undefined,
  };
};

const loadModel = () => {
  model.value = {
    id: props.data.id ?? 0,
    name: props.data.name ?? "",
    surname: props.data.surname ?? "",
    birthDate: props.data.birthDate ?? "",
    cpf: props.data.cpf ?? "",
    rg: props.data.rg ?? "",
    email: props.data.email ?? "",
    motherName: props.data.motherName ?? "",
    phone: props.data.phone ?? "",
    sexy: props.data.sexy,
    status: props.data.status ?? "A",
    cepAddress: {
      bairro: props.data.PatientAddress?.addressDistrict ?? "",
      complemento: props.data.PatientAddress?.addressComplement ?? "",
      localidade: props.data.PatientAddress?.addressCity ?? "",
      uf: props.data.PatientAddress?.addressState ?? "",
      numero: props.data.PatientAddress?.addressNumber ?? "",
      logradouro: props.data.PatientAddress?.addressStreet ?? "",
      cep: props.data.PatientAddress?.addressZipcode ?? "",
    },
    lawyer: props.data.User,
  };
};

const create = async () => {
  await itemStore.create({
    name: model.value.name,
    surname: model.value.surname,
    birthDate: model.value.birthDate,
    cpf: model.value.cpf,
    email: model.value.email,
    motherName: model.value.motherName,
    phone: model.value.phone,
    rg: model.value.rg,
    sexy: model.value.sexy,
    status: model.value.status,
    userId: model.value.lawyer?.id,
    PatientAddress: {
      addressCity: model.value.cepAddress?.localidade ?? "",
      addressComplement: model.value.cepAddress?.complemento ?? "",
      addressDistrict: model.value.cepAddress?.bairro ?? "",
      addressNumber: model.value.cepAddress?.numero ?? "",
      addressState: model.value.cepAddress?.uf ?? "",
      addressStreet: model.value.cepAddress?.logradouro ?? "",
      addressZipcode: model.value.cepAddress?.cep ?? "",
    },
  });
};

const update = async () => {
  await itemStore.update({
    publicId: props.data.publicId!,
    id: model.value.id,
    name: model.value.name,
    surname: model.value.surname,
    birthDate: model.value.birthDate,
    cpf: model.value.cpf,
    email: model.value.email,
    motherName: model.value.motherName,
    phone: model.value.phone,
    rg: model.value.rg,
    sexy: model.value.sexy,
    status: model.value.status,
    userId: model.value.lawyer?.id,
    PatientAddress: {
      addressCity: model.value.cepAddress?.localidade ?? "",
      addressComplement: model.value.cepAddress?.complemento ?? "",
      addressDistrict: model.value.cepAddress?.bairro ?? "",
      addressNumber: model.value.cepAddress?.numero ?? "",
      addressState: model.value.cepAddress?.uf ?? "",
      addressStreet: model.value.cepAddress?.logradouro ?? "",
      addressZipcode: model.value.cepAddress?.cep ?? "",
    },
  });
};

const handleClose = () => {
  clearModel();
  emit("close");
};
</script>
