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
      </v-row>
      <v-row dense>
        <v-col cols="12" lg="8">
          <StringInput
            v-model="model.officeName"
            label="Nome do escritório"
            placeholder="Nome do escritório"
            required
          />
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
  cpfCnpj: {
    text: "",
    value: "",
  },
  password: "",
  phone: {
    text: "",
    value: "",
  },
  oab: "",
  oabUf: "",
  officeName: "",
  active: true,
});

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
    email: "",
    oab: "",
    oabUf: "",
    officeName: "",
    active: true,
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
    email: props.data.email ?? "",
    active: props.data.active ?? false,
    oab: props.data.oab ?? "",
    oabUf: props.data.oabUf ?? "",
    officeName: props.data.officeName ?? "",
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
    phone: model.value.phone.value,
    cpfCnpj: model.value.cpfCnpj.value,
    password: model.value.password,
    oab: model.value.oab,
    oabUf: model.value.oabUf,
    officeName: model.value.officeName,
  });
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
  });
};

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
