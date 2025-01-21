<template>
  <FormCrud :on-submit="submitForm" :show-submit-button="false">
    <v-row>
      <v-col cols="12">
        <StringInput
          v-model="model.officeName"
          label="Escritório"
          placeholder="Nome do escritório"
          icon="mdi-office-building"
          required
        />
      </v-col>
      <v-col cols="12">
        <StringInput
          v-model="model.officeEmail"
          label="E-mail"
          placeholder="E-mail"
          icon="mdi-email-outline"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6">
        <TelefoneInput
          v-model="model.officePhone"
          label="Telefone"
          placeholder="Telefone"
          icon="mdi-phone-outline"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <CNPJInput
          v-model="model.officeCnpj"
          label="CNPJ"
          placeholder="CNPJ"
          icon="mdi-card-account-details-outline"
          required
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
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const submitForm = () => {
  emit("next");
};
</script>
