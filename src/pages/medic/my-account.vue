<template>
  <MedicMyAccount />
  <DialogLoading :dialog="loading" />
</template>

<script setup lang="ts">
const medicStore = useMedicStore();
const auth = useAuthStore();

const $currentUser = computed(() => auth.$currentUser);

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    await medicStore.show($currentUser.value?.publicId!);
  } finally {
    loading.value = false;
  }
});
</script>
