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
            v-model:model-text="model.phone.text"
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
            v-model:model-number="model.cpfCnpj.value"
            v-model:model-text="model.cpfCnpj.text"
            label="CPF"
            placeholder="CPF"
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
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

defineProps({
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
});
const emit = defineEmits(["close"]);

const { mobile } = useDisplay();
const medicStore = useMedicStore();

const model = ref({
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

const submitForm = async () => {
  await medicStore.create({
    crm: model.value.crm,
    crmUf: model.value.crmUf,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone.value,
    cpfCnpj: model.value.cpfCnpj.value,
    password: model.value.password,
  });

  await medicStore.index("");
  handleClose();
};

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
