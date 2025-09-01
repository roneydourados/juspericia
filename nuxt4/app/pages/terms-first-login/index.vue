<template>
  <v-card flat width="100%">
    <v-card-title>
      <div class="d-flex justify-end w-100 px-12">
        <strong class="text-primary"> Versão: {{ $single?.version }} </strong>
      </div>
    </v-card-title>
    <v-card-text class="px-12">
      <div v-html="$single?.content" />
    </v-card-text>
    <v-card-text>
      <NuxtTurnstile ref="turnstile" v-model="cloudFlareToken" />
    </v-card-text>
    <v-card-actions class="d-flex px-4">
      <Button
        @click="handleAccpetTerms"
        variant="outlined"
        color="grey"
        size="small"
        :loading="loading"
        :disabled="disabledButtons"
      >
        <v-icon icon="mdi-close" color="colorIcon" start />
        <span class="text-primary text-caption">
          Li e concordo com os termos
        </span>
      </Button>
      <Button
        @click="handleRejectTerms"
        variant="outlined"
        color="red"
        size="small"
        :loading="loading"
        :disabled="disabledButtons"
      >
        <v-icon icon="mdi-close" color="red" start />
        <span class="text-primary text-caption"> Não concordo </span>
      </Button>
    </v-card-actions>
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate />
    </v-overlay>
  </v-card>
</template>

<script setup lang="ts">
//import type { IpInfo } from "~/composables/useIpInfo";

definePageMeta({
  title: "Termos de Serviço",
  description: "Termos de Serviço",
  middleware: undefined,
  layout: "empty",
});

const cloudFlareToken = ref("");
const auth = useAuthStore();
const router = useRouter();
const termsStore = useTermsStore();
const loading = ref(false);
const disabledButtons = ref(true); // Inicialmente desabilitado até o Turnstile carregar
const $currentUser = computed(() => auth.$currentUser);
const $single = computed(() => termsStore.$single);
const { getIpInfo } = useIpInfo();

onMounted(async () => {
  await termsStore.getLastTerm();
});

// Watch para monitorar o token do Turnstile
watch(
  cloudFlareToken,
  (newToken) => {
    // Se o token estiver vazio, desabilita os botões
    // Se o token tiver valor, habilita os botões
    disabledButtons.value = !newToken || newToken.trim() === "";
  },
  {
    immediate: true,
  }
);

const handleAccpetTerms = async () => {
  if (!$currentUser.value) return;

  loading.value = true;
  disabledButtons.value = true;
  try {
    // Captura informações de IP
    const ipInfo: IpInfo = await getIpInfo();

    console.log("Informações de IP capturadas:", ipInfo);

    // Envia os dados para o back-end incluindo as informações de IP
    await auth.consentTerms(cloudFlareToken.value, ipInfo);
    await auth.verifyUser($currentUser.value.publicId!);

    // Aguarda a próxima atualização do DOM para garantir que o estado foi atualizado
    await nextTick();

    router.push("/");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    disabledButtons.value = false;
  }
};

const handleRejectTerms = () => {
  auth.logout();
  router.push("/");
};
</script>

<style scoped></style>
