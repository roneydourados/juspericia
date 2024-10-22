<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados escritório </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row dense>
          <v-col cols="12" lg="6">
            <StringInput
              v-model="model.officeName"
              label="Escritório"
              placeholder="Nome do escritório"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <StringInput
              v-model="model.officeEmail"
              label="E-mail"
              placeholder="E-mail"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="3">
            <TelefoneInput
              v-model="model.officePhone"
              label="Telefone"
              placeholder="Telefone"
            />
          </v-col>
          <v-col cols="12" lg="3">
            <CNPJInput
              v-model="model.officeCnpj"
              label="CNPJ"
              placeholder="CNPJ"
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
  emit("update");
};
</script>
