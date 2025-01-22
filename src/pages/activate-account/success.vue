<template>
  <v-empty-state
    headline="Conta ativa"
    title="Seja muito bem vindo!"
    text=""
    class="mt-n12"
  >
    <template #default>
      <div class="d-flex flex-column">
        <span class="mb-4 text-blue-grey-darken-1">
          Você será redirecionado para login em {{ countdown }}s
        </span>
        <AnimedSvg height="80" />
      </div>
    </template>
    <template #title>
      <div class="text-blue-grey-darken-1" style="max-width: 30rem">
        Sua conta foi ativada com sucesso. Agora você já pode disfrutar das
        funcionalidades do app.
      </div>
    </template>
  </v-empty-state>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Ativação",
  description: "Ativação de conta",
  layout: "register",
  middleware: undefined,
});

const router = useRouter();

const countdown = ref(3);

const startCountdown = () => {
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(interval);
      router.push("/");
    }
  }, 1000);
};

onMounted(() => {
  startCountdown();
});
</script>
