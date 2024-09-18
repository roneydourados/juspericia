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
            v-model="model.surname"
            label="Sobrenome"
            placeholder="Sobrenome"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="4">
          <CPFInput
            v-model:model-value="model.cpf.text"
            v-model:model-number="model.cpf.value"
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
            v-model:model-number="model.phone.value"
            v-model:model-value="model.phone.text"
            label="Whatsapp"
            placeholder="Whatsapp"
            required
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="6">
          <StringInput
            v-model="model.motherName"
            label="Nome da mãe"
            placeholder="Nome da mãe"
          />
        </v-col>
        <v-col cols="12" lg="6">
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
      <v-row v-if="$currentUser?.Profile.type === 'ADMIN'" dense>
        <v-col cols="12">
          <SelectSearchLawyer
            v-model="model.lawyer"
            clearable
            :required="$currentUser?.Profile.type === 'ADMIN'"
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { formatCPF, formatCEP } from "@brazilian-utils/brazilian-utils";

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
const { formatTelephoneNumber } = useUtils();

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
  cpf: {
    text: "",
    value: "",
  },
  rg: "",
  email: "",
  motherName: "",
  phone: {
    text: "",
    value: "",
  },
  sexy: undefined as string | undefined,
  status: "A",
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
    }

    await itemStore.index("");
    emit("close");
  } catch (error) {
    console.error(error);
  } finally {
    clearModel();
  }
};

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
    surname: "",
    birthDate: "",
    cpf: {
      text: "",
      value: "",
    },
    rg: "",
    email: "",
    motherName: "",
    phone: {
      text: "",
      value: "",
    },
    sexy: undefined,
    status: "A",
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
      CepAddress: undefined,
      text: "",
      value: "",
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
    cpf: {
      text: formatCPF(props.data.cpf ?? ""),
      value: props.data.cpf ?? "",
    },
    rg: props.data.rg ?? "",
    email: props.data.email ?? "",
    motherName: props.data.motherName ?? "",
    phone: {
      text: formatTelephoneNumber(props.data.phone ?? ""),
      value: props.data.phone ?? "",
    },
    sexy: props.data.sexy,
    status: props.data.status ?? "A",
    Address: {
      addressCity: props.data.Address.addressCity ?? "",
      addressComplement: props.data.Address.addressComplement ?? "",
      addressDistrict: props.data.Address.addressDistrict ?? "",
      addressNumber: props.data.Address.addressNumber ?? "",
      addressState: props.data.Address.addressState ?? "",
      addressStreet: props.data.Address.addressStreet ?? "",
      addressZipcode: props.data.Address.addressZipcode ?? "",
    },
    CepData: {
      CepAddress: undefined,
      text: formatCEP(props.data.Address.addressZipcode ?? ""),
      value: props.data.Address.addressZipcode ?? "",
    },
    lawyer: props.data.User,
  };
};

const create = async () => {
  await itemStore.create({
    name: model.value.name,
    surname: model.value.surname,
    birthDate: model.value.birthDate,
    cpf: model.value.cpf.value,
    email: model.value.email,
    motherName: model.value.motherName,
    phone: model.value.phone.value,
    rg: model.value.rg,
    sexy: model.value.sexy,
    status: model.value.status,
    userId: model.value.lawyer?.id,
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
  await itemStore.update({
    id: model.value.id,
    name: model.value.name,
    surname: model.value.surname,
    birthDate: model.value.birthDate,
    cpf: model.value.cpf.value,
    email: model.value.email,
    motherName: model.value.motherName,
    phone: model.value.phone.value,
    rg: model.value.rg,
    sexy: model.value.sexy,
    status: model.value.status,
    userId: model.value.lawyer?.id,
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
  clearModel();
  emit("close");
};
</script>
