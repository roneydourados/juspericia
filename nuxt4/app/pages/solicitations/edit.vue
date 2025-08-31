<template>
  <SolicitationForm show :data="$sigle" />
</template>

<script setup lang="ts">
const storeConsultation = useSolicitationConsultationStore();
const $sigle = computed(() => storeConsultation.$single);
const saltCredit = useUserCreditSaltStore();
const authStore = useAuthStore();

const $currentUser = computed(() => authStore.$currentUser);

onMounted(async () => {
  await saltCredit.getTotalSalt($currentUser.value?.publicId!);
});
</script>
