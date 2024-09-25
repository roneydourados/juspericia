<template>
  <MedicMyAccount />
</template>

<script setup lang="ts">
const medicStore = useMedicStore();
const auth = useAuthStore();

const $currentUser = computed(() => auth.$currentUser);

await useAsyncData(
  async () => await medicStore.show($currentUser.value?.publicId!)
);
</script>
