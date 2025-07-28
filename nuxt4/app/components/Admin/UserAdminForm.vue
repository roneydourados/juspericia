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
          <PasswordInput
            v-model="model.password"
            label="Senha temporária"
            placeholder="crie uma senha temporária"
            :required="!model.id"
            :strong="!!(model.id && model.id > 0 && model.password)"
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

const userAdminStore = useUserAdminStore();

const model = ref({
  id: 0,
  name: "",
  email: "",
  cpfCnpj: "",
  password: "",
  phone: "",
  active: true,
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
  };
};

const submitForm = async () => {
  try {
    if (model.value.id && model.value.id > 0) {
      await update();
    } else {
      await create();
    }
    await userAdminStore.index("");
    handleClose();
  } catch (error) {
    console.log("🚀 ~ submitForm user admin ~ error:", error);
  }
};

const create = async () => {
  await userAdminStore.create({
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    password: model.value.password,
  });
};

const update = async () => {
  await userAdminStore.update({
    publicId: props.data.publicId!,
    id: model.value.id,
    email: model.value.email,
    name: model.value.name,
    phone: model.value.phone,
    cpfCnpj: model.value.cpfCnpj,
    password: model.value.password,
    active: model.value.active,
  });
};

const handleClose = () => {
  emit("close");
  clearModel();
};
</script>
