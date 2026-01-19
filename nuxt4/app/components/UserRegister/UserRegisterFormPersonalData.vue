<template>
  <FormCrud :on-submit="submitForm" :show-submit-button="false">
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
      <v-col cols="12" lg="6">
        <CPFInput
          v-model="model.cpfCnpj"
          label="CPF"
          placeholder="CPF"
          required
          icon="mdi-card-account-details-outline"
          @update:model-value="model.officeCpfCnpj = model.cpfCnpj"
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
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <Button color="grey" variant="outlined" @click="router.push('/')">
          <v-icon icon="mdi-login" start color="colorIcon" />
          <span class="text-caption text-colorTextPrimary">
            Voltar para login
          </span>
        </Button>
        <Button color="primary" variant="flat" type="submit">
          <span class="text-caption text-white"> Próximo </span>
          <v-icon icon="mdi-chevron-right" end color="colorIcon" />
        </Button>
      </v-col>
    </v-row>
  </FormCrud>
</template>

<script setup lang="ts">
const emit = defineEmits(["next"]);
const router = useRouter();
const model = defineModel<UserModelProps>({
  default: () => ({}),
});

const submitForm = () => {
  emit("next");
};
</script>
