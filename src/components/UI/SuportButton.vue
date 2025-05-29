<template>
  <div>
    <v-fab
      :app="true"
      color="success"
      location="right bottom"
      size="60"
      icon
      @click="handleGetSuporte"
    >
      <v-icon icon="mdi-whatsapp" size="30" />
    </v-fab>
  </div>
  <DialogForm
    :show="showPopupSuport"
    title="Atendimento ao cliente"
    :width="mobile ? '100%' : '40%'"
    @dialog="showPopupSuport = false"
    icon="mdi-whatsapp"
  >
    <v-row>
      <v-col cols="12">
        <TextInput label="Uma prévia de sua dúvida" v-model="textSuport" />
      </v-col>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          class="text-none"
          color="primary"
          variant="flat"
          @click="sendSuport"
        >
          Enviar
        </v-btn>
      </v-col>
    </v-row>
  </DialogForm>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { whatsappUrl } = useUtils();
const auth = useAuthStore();
const systemParametersStore = useSystemParametersStore();

const $currentUser = computed(() => auth.$currentUser);
const $systemParameters = computed(() => systemParametersStore.$parameters);

const showPopupSuport = ref(false);
const loading = ref(false);
const textSuport = ref("");

const handleGetSuporte = async () => {
  await systemParametersStore.index();
  showPopupSuport.value = true;
};

const sendSuport = () => {
  loading.value = true;
  try {
    if ($systemParameters.value?.suportWhatsapp) {
      const text = textSuport.value
        ? textSuport.value
        : "Olá, preciso de suporte.";

      const url = whatsappUrl(
        $systemParameters.value.suportWhatsapp,
        `${$currentUser.value?.name} \n\n solicita suporte referente a: \n\n ${text}`,
        mobile.value
      );

      window.open(url, "_blank");

      textSuport.value = "";
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    showPopupSuport.value = loading.value;
  }
};
</script>
