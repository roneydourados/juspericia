<template>
  <MedicMyAccount />
</template>

<script setup lang="ts">
import { on } from "nodemailer/lib/xoauth2";

const medicStore = useMedicStore();
const auth = useAuthStore();

const $currentUser = computed(() => auth.$currentUser);

onMounted(async () => {
  await medicStore.show($currentUser.value?.publicId!);
});

// await useAsyncData(
//   async () => await medicStore.show($currentUser.value?.publicId!)
// );
</script>
