<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados de acesso </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row dense>
          <v-col cols="12" lg="8">
            <StringInput
              v-model="model.email"
              label="E-mail"
              placeholder="E-mail"
              disabled
              icon="mdi-email-outline"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="4">
            <PasswordInput
              v-model="model.password"
              label="Nova senha"
              placeholder="informe nova senha"
              icon="mdi-lock-outline"
              required
              strong
            />
          </v-col>
          <v-col cols="12" lg="4">
            <PasswordInput
              v-model="model.confirmPassword"
              label="Confirme a senha"
              placeholder="confirme a senha"
              icon="mdi-lock-outline"
              required
            />
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits(["update"]);
const model = defineModel<UserModelProps>("model", {
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
