<template>
  <v-card class="mx-auto py-8" flat :width="mobile ? '100%' : '900'">
    <v-card-title>
      <div
        class="d-flex align-center justify-center text-h5 font-weight-bold pa-6"
      >
        <v-icon icon="mdi-account-outline" start color="primary" />
        Criar conta
      </div>
    </v-card-title>
    <v-card-text>
      <v-stepper v-model="step" :items="items" elevation="0" hide-actions>
        <template v-slot:item.1>
          <v-card class="pa-2">
            <UserRegisterFormPersonalData v-model="model" />
          </v-card>
        </template>

        <template v-slot:item.2>
          <v-card class="pa-2">
            <UserRegisterFormAddress v-model="model" />
          </v-card>
        </template>

        <template v-slot:item.3>
          <v-card class="pa-2">
            <UserRegisterFormOffice v-model="model" />
          </v-card>
        </template>

        <template v-slot:item.4>
          <v-card class="pa-2">
            <UserRegisterFormAccessData v-model="model" />
          </v-card>
        </template>
        <template v-slot="{ next, prev }">
          <div class="d-flex justify-space-between px-4">
            <v-btn
              color="primary"
              @click="handlePrev(prev)"
              variant="tonal"
              class="text-none"
            >
              <v-icon icon="mdi-chevron-left" start />
              {{ labelPrev }}
            </v-btn>
            <v-btn
              color="primary"
              @click="handleNext(next)"
              variant="tonal"
              class="text-none"
            >
              {{ labelNext }}
              <v-icon icon="mdi-chevron-right" end />
            </v-btn>
          </div>
        </template>
      </v-stepper>
    </v-card-text>
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

const rounter = useRouter();
const auth = useAuthStore();
const userLawyerStore = useUserLawyerStore();

const items = ["Dados pessoais", "Endereço", "Escritório", "Acesso"];
const loading = ref(false);
const confirmRegister = ref(false);
const step = ref(1);
const labelPrev = ref("Voltar login");
const labelNext = ref("Próximo");
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
  officeCnpj: "",
  cepAddress: {
    cep: "",
    logradouro: "",
    complemento: "",
    bairro: "",
    localidade: "",
    numero: "",
    uf: "",
  },
});

const handleSubmitRegister = async () => {
  loading.value = true;
  confirmRegister.value = false;
  try {
    goLogin();
    // await userLawyerStore.update({
    //   id: model.value?.id,
    //   email: model.value?.email,
    //   name: model.value?.name,
    //   phone: model.value?.phone,
    //   whatsapp: model.value?.whatsapp,
    //   cpfCnpj: model.value?.cpfCnpj,
    //   password: model.value?.password ? model.value?.password : undefined,
    //   active: model.value?.active,
    //   oab: model.value?.oab,
    //   oabUf: model.value?.oabUf,
    //   officeName: model.value?.officeName,
    //   Address: {
    //     addressCity: model.value.cepAddress.localidade,
    //     addressComplement: model.value.cepAddress.complemento,
    //     addressDistrict: model.value.cepAddress.bairro,
    //     addressNumber: model.value.cepAddress.numero,
    //     addressState: model.value.cepAddress.uf,
    //     addressStreet: model.value.cepAddress.logradouro,
    //     addressZipcode: model.value.cepAddress.cep,
    //   },
    // });
  } catch (error) {
    console.error(error);
    push.error("Erro ao registrar, tente novamente!");
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  rounter.push("/");
};

const handlePrev = (prev: Function) => {
  if (labelNext.value !== "Próximo") {
    labelNext.value = "Próximo";
  }

  if (step.value === 1 && labelPrev.value === "Voltar login") {
    goLogin();
  } else if (
    (step.value === 1 || step.value === 2) &&
    labelPrev.value === "Anterior"
  ) {
    labelPrev.value = "Voltar login";
    prev();
  } else {
    prev();
  }
};

const handleNext = async (next: Function) => {
  if (step.value === 1 && labelPrev.value !== "Anterior") {
    labelPrev.value = "Anterior";
  }

  if (step.value !== 4) {
    next();
  }

  if (step.value === 4 && labelNext.value === "Registrar") {
    confirmRegister.value = true;
  }

  if (step.value === 4) {
    labelNext.value = "Registrar";
  }
};
</script>

<style scoped>
.selected-item {
  background-color: rgb(var(--v-theme-backMenu)) !important;
  color: rgb(var(--v-theme-itemInternalMenu)) !important;
}
</style>
