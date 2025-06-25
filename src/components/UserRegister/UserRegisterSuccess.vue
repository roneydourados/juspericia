<template>
  <v-empty-state>
    <template #default>
      <div class="d-flex flex-column" style="gap: 0.5rem">
        <div class="text-blue-grey-darken-1" style="max-width: 30rem">
          Seu cadastro foi realizado com sucesso!
        </div>
        <span class="text-blue-grey-darken-1">
          Enviamos mais orientações no email
        </span>
        <div class="d-flex flex-wrap">
          <v-icon icon="mdi-email-outline" color="blue" start />
          <span class="text-blue">{{ model.email }}</span>
        </div>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        class="text-none mt-12"
        size="small"
        @click="router.push('/')"
      >
        <v-icon icon="mdi-login" start />
        Voltar para login
      </v-btn>
    </template>
  </v-empty-state>
</template>

<script setup lang="ts">
const router = useRouter();
const model = defineModel<UserModelProps>({
  type: Object as PropType<UserModelProps>,
  default: () => ({}),
});
</script>
