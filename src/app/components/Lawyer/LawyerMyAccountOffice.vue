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
              icon="mdi-office-building"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <StringInput
              v-model="model.officeEmail"
              label="E-mail"
              placeholder="E-mail"
              icon="mdi-email-outline"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" lg="3">
            <TelefoneInput
              v-model="model.officePhone"
              label="Telefone"
              placeholder="Telefone"
              icon="mdi-phone-outline"
            />
          </v-col>
          <v-col cols="12" lg="3">
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
              @update:model-value="model.officeCpfCnpj = ''"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <div v-if="model.officePersonType === 'F'" class="d-flex flex-wrap">
              <CPFInput
                v-model="model.officeCpfCnpj"
                label="CPF"
                placeholder="CPF"
                icon="mdi-card-account-details"
                :required="model.officePersonType === 'F'"
              />
              <v-btn
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
              </v-btn>
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
