<template>
  <v-card class="mx-auto py-8" flat :width="mobile ? '100%' : '900'">
    <v-card-title>
      <v-row class="px-4">
        <v-col cols="12" lg="6" class="d-flex flex-column">
          <Logo height="60" color="#6A6CF0" />
          <span class="text-grey-darken-1 mt-2">
            Crie sua conta para começar a desfrutar de nossos serviços
          </span>
        </v-col>
      </v-row>
    </v-card-title>
    <v-stepper v-model="step" :items="items" elevation="0" hide-actions>
      <template v-slot:item.1>
        <v-card class="pa-2">
          <UserRegisterFormPersonalData v-model="model" @next="step = 2" />
        </v-card>
      </template>
      <template v-slot:item.2>
        <v-card class="pa-2">
          <UserRegisterFormAddress
            v-model="model"
            @next="step = 3"
            @prev="step = 1"
          />
        </v-card>
      </template>
      <template v-slot:item.3>
        <v-card class="pa-2">
          <UserRegisterFormOffice
            v-model="model"
            @next="step = 4"
            @prev="step = 2"
          />
        </v-card>
      </template>
      <template v-slot:item.4>
        <v-card class="pa-2">
          <UserRegisterFormAccessData
            v-model="model"
            @prev="step = 3"
            @register="handleSubmitRegister"
          />
        </v-card>
      </template>
      <template v-slot:item.5>
        <v-card class="pa-2">
          <UserRegisterSuccess v-model="model" />
        </v-card>
      </template>
    </v-stepper>
  </v-card>
  <Dialog
    title="Confirme cadastro na plataforma"
    :dialog="confirmRegister"
    @cancel="confirmRegister = false"
    @confirm="handleSubmitRegister"
    show-cancel
  >
    <span>Confirma registro ? </span>
  </Dialog>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const emit = defineEmits(["login"]);
const { mobile } = useDisplay();

//const rounter = useRouter();
const user = useAuthStore();

const items = ["Dados pessoais", "Endereço", "Escritório", "Acesso", "Fim"];
const loading = ref(false);
const confirmRegister = ref(false);
const step = ref(1);
const model = ref<UserModelProps>({
  id: 0,
  name: "",
  email: "",
  cpfCnpj: "",
  password: "",
  confirmPassword: "",
  phone: "",
  whatsapp: "",
  oab: "",
  oabUf: "",
  officeName: "",
  active: true,
  officePhone: "",
  officeEmail: "",
  officeCpfCnpj: "",
  officePersonType: "F",
  cepAddress: {
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    numero: "",
    uf: "",
  },
  tokenCapcha: "",
});

const handleSubmitRegister = async () => {
  loading.value = true;
  confirmRegister.value = false;
  try {
    await user.register({
      email: model.value?.email,
      name: model.value?.name,
      phone: model.value?.phone,
      whatsapp: model.value?.whatsapp,
      cpfCnpj: model.value?.cpfCnpj,
      password: model.value?.password ? model.value?.password : undefined,
      active: model.value?.active,
      oab: model.value?.oab,
      oabUf: model.value?.oabUf,
      officeName: model.value?.officeName,
      officePhone: model.value?.officePhone,
      officeCpfCnpj: model.value?.officeCpfCnpj,
      officePersonType: model.value?.officePersonType,
      officeEmail: model.value?.officeEmail,
      UserAddress: {
        addressCity: model.value.cepAddress.localidade,
        addressComplement: model.value.cepAddress.complemento,
        addressDistrict: model.value.cepAddress.bairro,
        addressNumber: model.value.cepAddress.numero,
        addressState: model.value.cepAddress.uf,
        addressStreet: model.value.cepAddress.logradouro,
        addressZipcode: model.value.cepAddress.cep,
      },
      tokenCapcha: model.value.tokenCapcha,
    });

    step.value = 5;
    //await rounter.push("/");
  } catch (error) {
    console.error(error);
    push.error("Erro ao registrar, tente novamente!");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.selected-item {
  background-color: rgb(var(--v-theme-backMenu)) !important;
  color: rgb(var(--v-theme-itemInternalMenu)) !important;
}
</style>
