<template>
  <FormCrud :on-submit="submitForm" :show-submit-button="false">
    <v-row>
      <v-col cols="12">
        <StringInput
          v-model="model.email"
          label="E-mail"
          placeholder="E-mail"
          icon="mdi-email-outline"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6">
        <PasswordInput
          v-model="model.password"
          label="Nova senha"
          placeholder="informe nova senha"
          icon="mdi-lock-outline"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <PasswordInput
          v-model="model.confirmPassword"
          label="Confirme a senha"
          placeholder="confirme a senha"
          icon="mdi-lock-outline"
        />
      </v-col>
    </v-row>
  </FormCrud>
</template>

<script setup lang="ts">
const emit = defineEmits(["update"]);
const model = defineModel<UserModelProps>({
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const submitForm = () => {
  if (
    model.value?.password &&
    model.value?.password !== model.value?.confirmPassword
  ) {
    push.warning("As senhas não conferem");
    return;
  }

  emit("update");
};
</script>
