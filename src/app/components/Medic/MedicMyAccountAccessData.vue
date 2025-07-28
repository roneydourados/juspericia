<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados de acesso </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row dense>
          <v-col cols="12" lg="6">
            <StringInput
              v-model="model.email"
              label="E-mail"
              placeholder="E-mail"
              disabled
            />
          </v-col>
          <v-col cols="12" lg="2">
            <StringInput
              v-model="model.crm"
              label="CRM"
              placeholder="E-mail"
              disabled
            />
          </v-col>
          <v-col cols="12" lg="2">
            <StatesSelectSearch
              v-model="model.crmUf"
              label="UF CRM"
              placeholder="UF CRM"
              disabled
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="4">
            <PasswordInput
              v-model="model.password"
              label="Nova senha"
              placeholder="informe nova senha"
            />
          </v-col>
          <v-col cols="12" lg="4">
            <PasswordInput
              v-model="model.confirmPassword"
              label="Confirme a senha"
              placeholder="confirme a senha"
            />
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits(["update"]);
const model = defineModel<UserMedicModelProps>("model", {
  type: Object as PropType<UserMedicModelProps>,
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
