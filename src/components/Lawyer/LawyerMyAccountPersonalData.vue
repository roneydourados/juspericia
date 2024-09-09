<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados pessoais </span>
    </v-card-title>
    <v-card-text>
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
          <v-col cols="12" lg="3">
            <TelefoneInput
              v-model:model-number="model.phone.value"
              v-model:model-value="model.phone.text"
              label="Telefone"
              placeholder="Telefone"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <CPFInput
              v-model:model-value="model.cpfCnpj.text"
              v-model:model-number="model.cpfCnpj.value"
              label="CPF"
              placeholder="CPF"
              required
            />
          </v-col>
          <v-col cols="12" lg="3">
            <StringInput
              v-model="model.oab"
              label="Nª OAB"
              placeholder="Nª OAB"
              required
            />
          </v-col>
          <v-col cols="12" lg="3">
            <StatesSelectSearch
              v-model="model.oabUf"
              label="UF OAB"
              placeholder="UF OAB"
              required
            />
          </v-col>
        </v-row>
      </FormCrud>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const userLawyerStore = useUserLawyerStore();

const emit = defineEmits(["update"]);

const model = defineModel<UserModelProps>("model", {
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const submitForm = () => {
  emit("update");
};
</script>
