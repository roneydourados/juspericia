<template>
  <v-empty-state headline="Erro ao ativar conta" text="" class="mt-n12">
    <template #default>
      <div class="d-flex flex-column">
        <span class="mb-4 text-blue-grey-darken-1" style="font-size: 1.5rem">
          Redirecionando para login em {{ countdown }}s
        </span>
        <AnimedSvg height="80" color="#6A6CF0" />
      </div>
    </template>
    <template #title>
      <div
        class="text-blue-grey-darken-1"
        style="max-width: 30rem; font-size: 1.5rem"
      >
        Link de ativação inválido ou expirado. Enviamos um novo link para o
        email cadastrado.
      </div>
    </template>
  </v-empty-state>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Ativação Erro",
  description: "Erro Ativação de conta",
  layout: "register",
  middleware: undefined,
});

const router = useRouter();
const route = useRoute();
const register = useAuthStore();

const countdown = ref(15);

const startCountdown = async () => {
  const id = route.params.id as string;

  await register.forgotActiveLink(id);

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
