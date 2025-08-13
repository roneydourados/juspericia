<template>
  <v-card variant="flat" class="mx-auto" color="transparent">
    <v-card-item>
      <div class="d-flex justify-space-between">
        <div class="d-flex" style="gap: 2rem">
          <div
            class="text-primary"
            style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem"
          >
            Início
          </div>
          <div class="d-flex flex-column text-primary">
            Olá Bem vindo(a) de volta,
            <strong>{{ $currentUser?.name }}</strong>
          </div>
        </div>
        <div class="d-flex flex-column text-primary">
          <div class="text-body-2 d-flex align-center justify-end">
            <span class="text-primary font-weight-bold">
              {{ $now.diaDaSemana }}
            </span>
          </div>
          <span class="text-caption">
            {{ $now.dia }} de {{ $now.mes }} de {{ $now.ano }}
          </span>
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();
const { formatDateExtensoObjeto } = useUtils();

const $currentUser = computed(() => auth.$currentUser);
const $now = computed(() => formatDateExtensoObjeto(new Date()));

const handleClickService = async (route: string) => {
  await router.push(route);
};
</script>

<style scoped></style>
