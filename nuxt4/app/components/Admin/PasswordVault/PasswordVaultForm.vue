<template>
  <DialogForm
    :show="show"
    title="Senha"
    width="600"
    border-color="#c8e040"
    @dialog="handleClose"
  >
    <FormCrud :on-submit="handleSubmit">
      <v-row dense>
        <v-col cols="12" lg="6">
          <StringInput
            v-model="data.title"
            label="Titulo"
            required
            icon="mdi-shield-key-outline"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <StringInput
            v-model="data.usuarioLogin"
            label="Usuario / Login"
            required
            icon="mdi-account-outline"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <StringInput
            v-model="data.appUrl"
            label="URL do app"
            icon="mdi-link-variant"
          />
        </v-col>
        <v-col cols="12" lg="6">
          <PasswordInput
            v-model="data.password"
            label="Senha"
            required
            icon="mdi-lock-outline"
          />
        </v-col>
        <v-col cols="12">
          <TextInput
            v-model="data.observation"
            label="Observacao"
            icon="mdi-text-box-outline"
          />
        </v-col>
      </v-row>
    </FormCrud>
  </DialogForm>
</template>

<script setup lang="ts">
type PasswordVaultFormModel = {
  title: string;
  usuarioLogin: string;
  appUrl: string;
  observation: string;
  password: string;
};

const show = defineModel<boolean>("show", { default: false });
const data = defineModel<PasswordVaultFormModel>("data", {
  default: () => ({
    title: "",
    usuarioLogin: "",
    appUrl: "",
    observation: "",
    password: "",
  }),
});

const emit = defineEmits(["submit", "close"]);

const handleSubmit = async () => {
  emit("submit");
};

const handleClose = () => {
  show.value = false;
  emit("close");
};
</script>
