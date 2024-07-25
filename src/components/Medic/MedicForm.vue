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
          <StatesSelect
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
            required
            type="password"
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
    crm: "",
    crmUf: "",
    email: "",
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
    crm: props.data.crm ?? "",
    crmUf: props.data.crmUf ?? "",
    email: props.data.email ?? "",
    active: props.data.active ?? false,
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
  });
};

const update = async () => {
  await medicStore.update({
    id: model.value.id,
    crm: model.value.crm,
    crmUf: model.value.crmUf,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone.value,
    cpfCnpj: model.value.cpfCnpj.value,
    password: model.value.password,
  });
};

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
