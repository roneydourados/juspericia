<template>
  <div class="d-flex align-center justify-center px-4">
    <div class="d-flex flex-column">
      <div class="text-center" style="font-size: 2rem; font-weight: 700">
        Termos e condições de uso
      </div>
      <div class="text-center text-h6" style="max-width: 30rem">
        Você ainda não aceitou nossos termos e condições de uso. Será necessário
        aceitar e concordar para continuar.
        <Button @click="handleOpenTerms" class="mt-4">
          Acessar termos e condições de uso
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Conceder Autorização Termos de Serviço",
  description: "Conceder Autorização Termos de Serviço",
  middleware: undefined,
  layout: "empty",
});

const router = useRouter();
const handleOpenTerms = () => {
  router.push("/terms-first-login");
};
</script>

<style scoped>
.background-image {
  background-image: url("@/assets/images/juspericialogin.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
</style>
