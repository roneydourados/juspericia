<template>
  <FormCrud :on-submit="submitForm" :show-submit-button="false">
    <v-row dense>
      <v-col cols="12">
        <StringInput
          v-model="model.officeName"
          label="Escritório"
          placeholder="Nome do escritório"
          icon="mdi-office-building"
          required
        />
      </v-col>
      <v-col cols="12" lg="8">
        <StringInput
          v-model="model.officeEmail"
          label="E-mail"
          placeholder="E-mail"
          icon="mdi-email-outline"
          required
          is-lower-case
        />
      </v-col>
      <v-col cols="12" lg="4">
        <TelefoneInput
          v-model="model.officePhone"
          label="Telefone"
          placeholder="Telefone"
          icon="mdi-phone-outline"
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" lg="4">
        <SelectInput
          v-model="model.officePersonType"
          label="Tipo"
          item-title="text"
          item-value="value"
          :items="[
            { text: 'Física', value: 'F' },
            {
              text: 'Jurídica',
              value: 'J',
            },
          ]"
          @update:model-value="handleChangePersonType"
        />
      </v-col>
      <v-col cols="12" lg="8">
        <div v-if="model.officePersonType === 'F'" class="d-flex flex-wrap">
          <CPFInput
            v-model="model.officeCpfCnpj"
            label="CPF"
            placeholder="CPF"
            icon="mdi-card-account-details"
            :disabled="model.officePersonType === 'F'"
          />
          <!-- <v-btn
            icon
            color="success"
            variant="flat"
            size="x-small"
            class="ml-2"
            @click="model.officeCpfCnpj = model.cpfCnpj"
          >
            <v-icon icon="mdi-card-account-details" size="18" />
            <v-tooltip
              activator="parent"
              location="top center"
              content-class="tooltip-background"
            >
              Clique para usar mesmo CPF do usuário
            </v-tooltip>
          </v-btn> -->
        </div>
        <CNPJInput
          v-else
          v-model="model.officeCpfCnpj"
          label="CNPJ"
          placeholder="CNPJ"
          icon="mdi-card-account-details-outline"
          :required="model.officePersonType === 'J'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <Button color="grey" variant="outlined" @click="emit('prev')">
          <v-icon icon="mdi-chevron-left" start color="colorIcon" />
          <span class="text-caption"> Anterior </span>
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
import CPFInput from "../UI/inputs/CPFInput.vue";

const emit = defineEmits(["next", "prev"]);

const model = defineModel<UserModelProps>({
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});

const submitForm = () => {
  emit("next");
};

const handleChangePersonType = () => {
  if (model.value.officePersonType === "F") {
    model.value.officeCpfCnpj = model.value.cpfCnpj;
  } else {
    model.value.officeCpfCnpj = "";
  }
};
</script>
