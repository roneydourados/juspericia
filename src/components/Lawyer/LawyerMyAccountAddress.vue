<template>
  <v-card flat rounded="lg">
    <v-card-title>
      <span class="text-subtitle-1"> Dados de endereço </span>
    </v-card-title>
    <v-card-text>
      <FormCrud :on-submit="submitForm">
        <v-row>
          <v-col cols="12" lg="3">
            <CepInput
              label="Cep"
              icon="mdi-map-marker-radius-outline"
              :clearable="true"
              v-model="model.cepAddress.cep"
              v-model:model-address="model.cepAddress"
            />
          </v-col>
          <v-col cols="12" lg="7">
            <StringInput
              label="Rua"
              :clearable="true"
              v-model="model.cepAddress.logradouro"
              icon="mdi-map-marker-outline"
            />
          </v-col>
          <v-col cols="12" lg="2">
            <StringInput
              label="Nº"
              :clearable="true"
              v-model="model.cepAddress.numero"
              icon="mdi-map-marker-outline"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="5">
            <StringInput
              label="Bairro"
              :clearable="true"
              v-model="model.cepAddress.bairro"
              icon="mdi-map-marker-outline"
            />
          </v-col>
          <v-col cols="12" lg="5">
            <StringInput
              label="Cidade"
              :clearable="true"
              v-model="model.cepAddress.localidade"
              icon="mdi-map-marker-outline"
            />
          </v-col>
          <v-col cols="12" md="2">
            <StatesSelectSearch
              v-model="model.cepAddress.uf"
              icon="mdi-map-marker-outline"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <StringInput
              label="Complemento"
              :clearable="true"
              v-model="model.cepAddress.complemento"
              icon="mdi-map-marker-outline"
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
  default: () => ({}),
});

const submitForm = () => {
  emit("update");
};
</script>
