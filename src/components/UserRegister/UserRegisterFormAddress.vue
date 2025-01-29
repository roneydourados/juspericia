<template>
  <FormCrud :on-submit="submitForm" :show-submit-button="false">
    <v-row>
      <v-col cols="12" lg="3">
        <CepInput
          label="Cep"
          icon="mdi-map-marker-radius-outline"
          :clearable="true"
          v-model="model.cepAddress.cep"
          v-model:model-address="model.cepAddress"
          required
        />
      </v-col>
      <v-col cols="12" lg="7">
        <StringInput
          label="Rua"
          :clearable="true"
          v-model="model.cepAddress.logradouro"
          icon="mdi-map-marker-outline"
          required
        />
      </v-col>
      <v-col cols="12" lg="2">
        <StringInput
          label="Nº"
          :clearable="true"
          v-model="model.cepAddress.numero"
          icon="mdi-map-marker-outline"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="4">
        <StringInput
          label="Bairro"
          :clearable="true"
          v-model="model.cepAddress.bairro"
          icon="mdi-map-marker-outline"
          required
        />
      </v-col>
      <v-col cols="12" lg="5">
        <StringInput
          label="Cidade"
          :clearable="true"
          v-model="model.cepAddress.localidade"
          icon="mdi-map-marker-outline"
          required
        />
      </v-col>
      <v-col cols="12" md="3">
        <StatesSelectSearch
          v-model="model.cepAddress.uf"
          icon="mdi-map-marker-outline"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <StringInput
          label="Complemento"
          :clearable="true"
          v-model="model.cepAddress.complemento"
          icon="mdi-map-marker-outline"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn
          color="primary"
          variant="tonal"
          class="text-none"
          @click="emit('prev')"
        >
          <v-icon icon="mdi-chevron-left" start />
          Anterior
        </v-btn>
        <v-btn type="submit" color="primary" variant="tonal" class="text-none">
          Próximo
          <v-icon icon="mdi-chevron-right" end />
        </v-btn>
      </v-col>
    </v-row>
  </FormCrud>
</template>

<script setup lang="ts">
const emit = defineEmits(["next", "prev"]);

const model = defineModel<UserModelProps>({
  default: () => ({}),
});

const submitForm = () => {
  emit("next");
};
</script>
