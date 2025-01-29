<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados pessoais </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row dense>
          <v-col cols="12">
            <StringInput
              v-model="model.name"
              label="Nome"
              placeholder="Nome"
              required
              icon="mdi-account-outline"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="6">
            <TelefoneInput
              v-model="model.phone"
              label="Telefone"
              placeholder="Telefone"
              icon="mdi-phone-outline"
              required
            />
          </v-col>
          <v-col cols="12" lg="6">
            <TelefoneInput
              v-model="model.whatsapp"
              label="whatsapp"
              placeholder="whatsapp"
              icon="mdi-whatsapp"
              required
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="3">
            <CPFInput
              v-model="model.cpfCnpj"
              label="CPF"
              placeholder="CPF"
              required
              icon="mdi-card-account-details-outline"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <StringInput
              v-model="model.oab"
              label="Nª OAB"
              placeholder="Nª OAB"
              required
              icon="mdi-file-document-outline"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <StatesSelectSearch
              v-model="model.oabUf"
              label="UF OAB"
              placeholder="UF OAB"
              required
              icon="mdi-map-marker-outline"
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
