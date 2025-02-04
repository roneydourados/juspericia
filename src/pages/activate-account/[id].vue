<template>
  <v-card elevation="12" rounded="xl">
    <div class="d-flex flex-column align-center w-100 pa-8" style="gap: 1rem">
      <Logo height="50" />
      <h1 class="text-blue-grey-lighten-1 mt-8" style="font-weight: 100">
        Ativando conta...
      </h1>
    </div>
  </v-card>
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
definePageMeta({
  title: "Login",
  description: "Login page",
  layout: "empty",
  middleware: undefined,
});

const auth = useAuthStore();
const route = useRoute();
const rounter = useRouter();
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const id = route.params.id as string;

    //await useAsyncData("activateAccount", () => auth.activeAccount(id));
    await auth.activeAccount(id);

    await rounter.push("/activate-account/success");
  } catch (error) {
    await rounter.push(`/activate-account/error/${route.params.id}`);
    console.error(error);
  } finally {
    loading.value = false;
  }
});

// try {
//   const id = route.params.id as string;

//   //await useAsyncData("activateAccount", () => auth.activeAccount(id));
//   await auth.activeAccount(id);

//   rounter.push("/activate-account/success");
// } catch (error) {
//   rounter.push(`/activate-account/error/${route.params.id}`);
//   console.error(error);
// }
</script>
